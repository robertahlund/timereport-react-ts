import React, {
  ChangeEvent,
  FunctionComponent, useContext,
  useEffect,
  useState
} from "react";
import {ContentSection} from "../employees/Employees";
import TimeReportWrapper from "./TimeReportWrapper";
import {
  addDays,
  endOfWeek,
  format,
  isEqual,
  startOfWeek,
  subDays
} from "date-fns";
import produce from "immer";
import {AuthContext, AuthObject} from "../../App";
import {ActivitySelectOptions} from "../companies/CompanyModal";
import {getAllActivitiesAssignedToUser} from "../../api/employeeApi";
import {ValueType} from "react-select/lib/types";
import {ActivityCompanySelectOption} from "../../api/companyApi";
import {createOrUpdateTimeReportRows, deleteTimeReport, getTimeReportsByDate} from "../../api/timeReportApi";

export interface DateSelectorValue {
  from: string;
  to: string;
}

export interface TimeReportRow {
  date: Date;
  prettyDate: string;
  hours: string;
}

export interface TimeReport {
  id: string;
  userId: string;
  date: Date;
  prettyDate: string;
  activityId: string;
  activityName?: string;
  companyId: string;
  companyName?: string;
  timeReportRows: TimeReportRow[];
}

export interface TimeReportSummary {
  total: number;
  rowTotals: TimeReportRowSummary[]
}

export interface TimeReportRowSummary {
  total: number;
}

type DateSelectorStartValueFormatType = "MMM[ ]D";
type DateSelectorEndValueFormatType = "[ - ]MMM[ ]D[, ]YYYY";
export type TimeStampFormat = "HH[:]mm[:]ss";
export const dateSelectorStartValueFormat: DateSelectorStartValueFormatType =
  "MMM[ ]D";
export const dateSelectorEndValueFormat: DateSelectorEndValueFormatType =
  "[ - ]MMM[ ]D[, ]YYYY";
export const timeStampFormat: TimeStampFormat = "HH[:]mm[:]ss";

type TimeReportDateFormat = "YYYY-MM-DD";
const timeReportDateFormat: TimeReportDateFormat = "YYYY-MM-DD";

const initialTimeReportRows: TimeReport[] = [];

const Time: FunctionComponent = () => {
  const authContext = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(
    startOfWeek(new Date(), {weekStartsOn: 1})
  );
  const initialDateSelectorValue: DateSelectorValue = {
    from: format(selectedDate, dateSelectorStartValueFormat),
    to: format(selectedDate, dateSelectorEndValueFormat)
  };
  const [dateSelectorValue, setDateSelectorValue] = useState(
    initialDateSelectorValue
  );
  const [timeReportRows, setTimeReportRows] = useState(initialTimeReportRows);
  const initialActivitySelect: ActivitySelectOptions[] = [];
  const [activitySelectOptions, setActivitySelectOptions] = useState(initialActivitySelect);
  const initialTotal: TimeReportSummary = {
    total: 0,
    rowTotals: [{total: 0}, {total: 0}, {total: 0}, {total: 0}, {total: 0}, {total: 0}, {total: 0}]
  };
  const [total, setTotal] = useState(initialTotal);
  const [lastSaved, setLastSaved] = useState("");
  const [timeReportLoading, setTimeReportLoading] = useState(false);

  const getFirstAndLastDayOfWeek = (date: Date) => {
    const dateSelectorValue: DateSelectorValue = {
      from: format(
        startOfWeek(date, {weekStartsOn: 1}),
        dateSelectorStartValueFormat
      ),
      to: format(
        endOfWeek(date, {weekStartsOn: 1}),
        dateSelectorEndValueFormat
      )
    };
    setDateSelectorValue(dateSelectorValue);
  };

  useEffect(() => {
    getFirstAndLastDayOfWeek(selectedDate);
    // noinspection JSIgnoredPromiseFromCall
    getInitialData(selectedDate);
  }, []);

  const getInitialData = async (date: Date): Promise<void> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    setTimeReportLoading(true);
    const timeReports = await getTimeReportsByDate(format(date, timeReportDateFormat), authContext.uid);
    if (typeof timeReports !== "string") {
      setTimeReportRows(timeReports);
      const userActivities: ActivityCompanySelectOption[] | string = await getAllAssignedActivities();
      if (typeof userActivities !== "string") {
        removeActivityFromCombobox(undefined, timeReports, userActivities);
      }
      calculateTotals(timeReports);
    }
    setTimeReportLoading(false);
  };

  const handleWeekChange = async (direction: "prev" | "next"): Promise<void> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    setTimeReportLoading(true);
    if (direction === "prev") {
      const newSelectedDate = subDays(selectedDate, 7);
      const newWeekStartDate = startOfWeek(newSelectedDate, {weekStartsOn: 1});
      setSelectedDate(newWeekStartDate);
      getFirstAndLastDayOfWeek(newSelectedDate);
      await getInitialData(newWeekStartDate);
    } else {
      const newSelectedDate = addDays(selectedDate, 7);
      const newWeekStartDate = startOfWeek(newSelectedDate, {weekStartsOn: 1});
      setSelectedDate(newWeekStartDate);
      getFirstAndLastDayOfWeek(newSelectedDate);
      await getInitialData(newWeekStartDate);
    }
    setTimeReportLoading(false);
  };

  const onTimeReportRowChange = (
    event: ChangeEvent<HTMLInputElement>,
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => {
    if (timeReportIndex !== undefined && timeReportRowIndex !== undefined) {
      //https://github.com/immerjs/immer
      setTimeReportRows(
        produce(timeReportRows, draft => {
          draft[timeReportIndex].timeReportRows[timeReportRowIndex].hours =
            event.target.value;
        })
      );
      calculateTotals(produce(timeReportRows, draft => {
        draft[timeReportIndex].timeReportRows[timeReportRowIndex].hours =
          event.target.value;
      }))
    }
  };

  const getAllAssignedActivities = async (): Promise<ActivityCompanySelectOption[] | string> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return new Promise<ActivityCompanySelectOption[] | string>(reject => reject("Error"));
    }
    const userActivities: ActivityCompanySelectOption[] | string = await getAllActivitiesAssignedToUser(authContext.uid);
    if (typeof userActivities !== "string") {
      setActivitySelectOptions(userActivities);
      return new Promise<ActivityCompanySelectOption[] | string>(resolve => resolve(userActivities))
    }
    return new Promise<ActivityCompanySelectOption[] | string>(reject => reject("Error"))
  };

  const handleSelectChange = (option: ValueType<any>): void => {
    // noinspection JSIgnoredPromiseFromCall
    createTimeReportRow(option);
    removeActivityFromCombobox(option.value)
  };

  const createTimeReportRow = async (activity: ActivityCompanySelectOption): Promise<void> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    const firstDayOfWeekDate: Date = selectedDate;
    const newTimeReportRow: TimeReport = {
      id: "",
      userId: authContext.uid,
      activityId: activity.value,
      activityName: activity.label.split("-")[1].trimStart(),
      companyId: activity.companyId,
      companyName: activity.companyName,
      date: firstDayOfWeekDate,
      prettyDate: format(firstDayOfWeekDate, timeReportDateFormat),
      timeReportRows: []
    };
    for (let i = 0; i <= 6; i++) {
      const newDate: Date = addDays(firstDayOfWeekDate, i);
      const timeReportCell: TimeReportRow = {
        date: newDate,
        prettyDate: format(newDate, timeReportDateFormat),
        hours: ""
      };
      newTimeReportRow.timeReportRows.push(timeReportCell);
    }
    const savedTimeReportRow = await createOrUpdateTimeReportRows([newTimeReportRow]);
    setLastSaved(format(new Date(), timeStampFormat));
    if (typeof savedTimeReportRow !== "string") {
      setTimeReportRows([...timeReportRows, ...savedTimeReportRow]);
    }
  };

  const removeActivityFromCombobox = (activityId?: string, timeReports?: TimeReport[], userActivities?: ActivityCompanySelectOption[]): void => {
    if (userActivities && timeReports && !activityId) {
      timeReports.forEach(timeReport => {
        userActivities = [...userActivities!.filter(activity => activity.value !== timeReport.activityId)]
      });
      setActivitySelectOptions(userActivities)
    } else {
      setActivitySelectOptions([...activitySelectOptions.filter(activity => activity.value !== activityId)]);
    }
  };

  const addActivityToCombobox = (activity: ActivityCompanySelectOption): void => {
    setActivitySelectOptions([...activitySelectOptions, activity])
  };

  const calculateTotals = (timeReportRows: TimeReport[]) => {
    const total: TimeReportSummary = initialTotal;
    timeReportRows.forEach(timeReport => {
      timeReport.timeReportRows.forEach((row, index) => {
        total.rowTotals[index].total += Number(row.hours);
        total.total += Number(row.hours)
      })
    });
    setTotal(total);
  };

  const deleteRow = async (timeReport: TimeReport): Promise<void> => {
    try {
      await deleteTimeReport(timeReport.id);
      setTimeReportRows([...timeReportRows].filter(timeReportRow => timeReportRow.id !== timeReport.id));
      calculateTotals([...timeReportRows].filter(timeReportRow => timeReportRow.id !== timeReport.id));
      setLastSaved(format(new Date(), timeStampFormat));
      if (timeReport.activityName && timeReport.companyName) {
        addActivityToCombobox({
          value: timeReport.activityId,
          label: `${timeReport.companyName} - ${timeReport.activityName}`,
          companyId: timeReport.companyId,
          companyName: timeReport.companyName
        })
      }
    } catch (error) {
      console.log(error)
    }
  };

  const saveRows = async (): Promise<void> => {
    try {
      const savedRows = await createOrUpdateTimeReportRows(timeReportRows);
      if (typeof savedRows !== "string") {
        setTimeReportRows(savedRows);
        setLastSaved(format(new Date(), timeStampFormat))
      }
      console.log(savedRows)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <ContentSection>
      <TimeReportWrapper
        handleWeekChange={handleWeekChange}
        dateSelectorValue={dateSelectorValue}
        selectedDate={selectedDate}
        timeReportRows={timeReportRows}
        onTimeReportRowChange={onTimeReportRowChange}
        selectOptions={activitySelectOptions}
        handleSelectChange={handleSelectChange}
        saveRows={saveRows}
        total={total}
        lastSaved={lastSaved}
        timeReportLoading={timeReportLoading}
        deleteRow={deleteRow}
      />
    </ContentSection>
  );
};

export default Time;
