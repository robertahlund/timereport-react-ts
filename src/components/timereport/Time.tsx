import React, {
  ChangeEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import { ContentSection } from "../employees/Employees";
import TimeReportWrapper from "./TimeReportWrapper";
import { addDays, endOfWeek, format, startOfWeek, subDays } from "date-fns";
import produce from "immer";
import { getAllActivitiesAssignedToUser } from "../../api/employeeApi";
import { ValueType } from "react-select/lib/types";
import {
  createOrUpdateTimeReportRows,
  deleteTimeReport,
  getTimeReportsByDate
} from "../../api/timeReportApi";
import "../../styles/time-react-select.css";
import "../../styles/close-button-transition.css";
import { validateNumberInput } from "../../utilities/validateNumberInput";
import {
  dateSelectorEndValueFormat,
  dateSelectorStartValueFormat,
  initialActivitySelect,
  initialDateSelectorValue,
  initialTimeReportRows,
  initialTotal,
  timeReportDateFormat,
  timeStampFormat
} from "../../constants/timeReportConstants";
import {AuthContext} from "../../context/authentication/authenticationContext";
import {
  ActivityCompanySelectOption,
  DateSelectorValue,
  TimeReport,
  TimeReportRow,
  TimeReportSummary
} from "../../types/types";

const Time: FunctionComponent = () => {
  const authContext = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [dateSelectorValue, setDateSelectorValue] = useState(
    initialDateSelectorValue
  );
  const [timeReportRows, setTimeReportRows] = useState(initialTimeReportRows);
  const [activitySelectOptions, setActivitySelectOptions] = useState(
    initialActivitySelect
  );
  const [total, setTotal] = useState(initialTotal);
  const [lastSaved, setLastSaved] = useState("");
  const [timeReportLoading, setTimeReportLoading] = useState(false);
  const [rowIsSaved, setRowIsSaved] = useState(true);

  useEffect(() => {
    document.title = "Report Time";
    getFirstAndLastDayOfWeek(selectedDate);
    // noinspection JSIgnoredPromiseFromCall
    getInitialData(selectedDate);
  }, []);

  const getFirstAndLastDayOfWeek = (date: Date) => {
    const dateSelectorValue: DateSelectorValue = {
      from: format(
        startOfWeek(date, { weekStartsOn: 1 }),
        dateSelectorStartValueFormat
      ),
      to: format(
        endOfWeek(date, { weekStartsOn: 1 }),
        dateSelectorEndValueFormat
      )
    };
    setDateSelectorValue(dateSelectorValue);
  };

  const getInitialData = async (date: Date): Promise<void> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    setTimeReportLoading(true);
    const timeReports = await getTimeReportsByDate(
      format(date, timeReportDateFormat),
      authContext.uid
    );
    if (typeof timeReports !== "string") {
      setTimeReportRows(timeReports);
      const userActivities:
        | ActivityCompanySelectOption[]
        | string = await getAllAssignedActivities();
      if (typeof userActivities !== "string") {
        removeActivityFromCombobox(
          undefined,
          undefined,
          timeReports,
          userActivities
        );
      }
      calculateTotals(timeReports);
    }
    setTimeReportLoading(false);
  };

  const handleWeekChange = async (
    direction: "prev" | "next"
  ): Promise<void> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    setTimeReportLoading(true);
    if (direction === "prev") {
      const newSelectedDate = subDays(selectedDate, 7);
      const newWeekStartDate = startOfWeek(newSelectedDate, {
        weekStartsOn: 1
      });
      setSelectedDate(newWeekStartDate);
      getFirstAndLastDayOfWeek(newSelectedDate);
      await getInitialData(newWeekStartDate);
    } else {
      const newSelectedDate = addDays(selectedDate, 7);
      const newWeekStartDate = startOfWeek(newSelectedDate, {
        weekStartsOn: 1
      });
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
    if (!validateNumberInput(event.target.value)) {
      return;
    }

    let { value } = event.target;
    //if the value is a decimal we can round it to 2 decimal points
    if (value.indexOf(".") > -1 && value.indexOf(".") !== value.length - 1) {
      value = String(Math.round(Number(event.target.value) * 100) / 100);
    }

    if (timeReportIndex !== undefined && timeReportRowIndex !== undefined) {
      //https://github.com/immerjs/immer
      setTimeReportRows(
        produce(timeReportRows, draft => {
          draft[timeReportIndex].timeReportRows[
            timeReportRowIndex
          ].hours = value;
        })
      );
      calculateTotals(
        produce(timeReportRows, draft => {
          draft[timeReportIndex].timeReportRows[
            timeReportRowIndex
          ].hours = value;
        })
      );
    }
  };

  const getAllAssignedActivities = async (): Promise<
    ActivityCompanySelectOption[] | string
  > => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return new Promise<ActivityCompanySelectOption[] | string>(reject =>
        reject("Error")
      );
    }
    const userActivities:
      | ActivityCompanySelectOption[]
      | string = await getAllActivitiesAssignedToUser(authContext.uid);
    if (typeof userActivities !== "string") {
      setActivitySelectOptions(userActivities);
      return new Promise<ActivityCompanySelectOption[] | string>(resolve =>
        resolve(userActivities)
      );
    }
    return new Promise<ActivityCompanySelectOption[] | string>(reject =>
      reject("Error")
    );
  };

  const handleSelectChange = (option: ValueType<any>): void => {
    createTimeReportRow(option);
    removeActivityFromCombobox(option.value, option.companyId);
  };

  const createTimeReportRow = (activity: ActivityCompanySelectOption): void => {
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
    setTimeReportRows([...timeReportRows, newTimeReportRow]);
  };

  const removeActivityFromCombobox = (
    activityId?: string,
    companyId?: string,
    timeReports?: TimeReport[],
    userActivities?: ActivityCompanySelectOption[]
  ): void => {
    if (userActivities && timeReports && !activityId && !companyId) {
      timeReports.forEach(timeReport => {
        userActivities = [
          ...userActivities!.filter(activity => {
            if (
              activity.companyId !== timeReport.companyId &&
              activity.value !== timeReport.activityId
            ) {
              return true;
            } else if (
              activity.companyId === timeReport.companyId &&
              activity.value === timeReport.activityId
            ) {
              return false;
            } else return true;
          })
        ];
      });
      setActivitySelectOptions(userActivities);
    } else {
      setActivitySelectOptions([
        ...activitySelectOptions.filter(activity => {
          if (
            activity.companyId !== companyId &&
            activity.value !== activityId
          ) {
            return true;
          } else if (
            activity.companyId === companyId &&
            activity.value === activityId
          ) {
            return false;
          } else return true;
        })
      ]);
    }
  };

  const addActivityToCombobox = (
    activity: ActivityCompanySelectOption
  ): void => {
    setActivitySelectOptions([...activitySelectOptions, activity]);
  };

  const calculateTotals = (timeReportRows: TimeReport[]) => {
    let total: TimeReportSummary = JSON.parse(JSON.stringify(initialTotal));
    timeReportRows.forEach(timeReport => {
      timeReport.timeReportRows.forEach((row, index) => {
        total.rowTotals[index].total += Number(row.hours);
        total.total += Number(row.hours);
      });
    });
    setTotal(total);
  };

  const deleteRow = async (timeReport: TimeReport): Promise<void> => {
    try {
      await deleteTimeReport(timeReport.id);
      setTimeReportRows(
        [...timeReportRows].filter(
          timeReportRow => timeReportRow.id !== timeReport.id
        )
      );
      calculateTotals(
        [...timeReportRows].filter(
          timeReportRow => timeReportRow.id !== timeReport.id
        )
      );
      if (timeReport.activityName && timeReport.companyName) {
        addActivityToCombobox({
          value: timeReport.activityId,
          label: `${timeReport.companyName} - ${timeReport.activityName}`,
          companyId: timeReport.companyId,
          companyName: timeReport.companyName
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveRows = async (): Promise<void> => {
    try {
      const savedRows = await createOrUpdateTimeReportRows(timeReportRows);
      if (typeof savedRows !== "string") {
        setTimeReportRows(savedRows);
        setLastSaved(format(new Date(), timeStampFormat));
      }
      console.log(savedRows);
    } catch (error) {
      console.log(error);
    }
  };

  const saveSingleRow = async (
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ): Promise<void> => {
    if (timeReportRowIndex !== undefined && timeReportIndex !== undefined) {
      const timeReport = timeReportRows[timeReportIndex];
      console.log(timeReport);
      try {
        if (checkIfAllCellsOnRowAreZero(timeReport) || !rowIsSaved) {
          return;
        } else {
          setRowIsSaved(false);
          const savedRows = await createOrUpdateTimeReportRows([timeReport]);
          if (typeof savedRows !== "string") {
            if (timeReport.id === "") {
              setTimeReportRows(
                produce(timeReportRows, draft => {
                  draft[timeReportIndex].id = savedRows[0].id;
                })
              );
            }
            setLastSaved(format(new Date(), timeStampFormat));
            setRowIsSaved(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const checkIfAllCellsOnRowAreZero = (timeReport: TimeReport): boolean => {
    return timeReport.timeReportRows.every(
      timeReportCell => timeReportCell.hours === ""
    );
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
        saveSingleRow={saveSingleRow}
      />
    </ContentSection>
  );
};

export default Time;
