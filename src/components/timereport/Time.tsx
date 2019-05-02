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
  getMonth,
  getYear,
  isEqual,
  lastDayOfMonth,
  parse,
  startOfWeek,
  subDays
} from "date-fns";
import produce from "immer";
import {AuthContext, AuthObject} from "../../App";
import {ActivitySelectOptions} from "../companies/CompanyModal";
import {getAllActivitiesAssignedToUser} from "../../api/employeeApi";
import {ValueType} from "react-select/lib/types";
import {ActivityCompanySelectOption} from "../../api/companyApi";

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
export const dateSelectorStartValueFormat: DateSelectorStartValueFormatType =
  "MMM[ ]D";
export const dateSelectorEndValueFormat: DateSelectorEndValueFormatType =
  "[ - ]MMM[ ]D[, ]YYYY";

type TimeReportDateFormat = "YYYY-MM-DD";
const timeReportDateFormat: TimeReportDateFormat = "YYYY-MM-DD";

//En tidrapport per aktivitet och företag och månad
/*const FAKE_TIME_REPORT_ROWS: TimeReport[] = [
  {
    userId: "",
    date: new Date(),
    prettyDate: "",
    activityId: "",
    activityName: "En aktivitet",
    companyId: "",
    companyName: "Ett företag",
    timeReportRows: [
      {
        date: new Date(),
        prettyDate: format(new Date(), timeReportDateFormat),
        hours: "5"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "3"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "3"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "1"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "0.3"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "1.3"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "1.9"
      }
    ]
  },
  {
    userId: "",
    date: new Date(),
    prettyDate: "",
    activityId: "",
    activityName: "En aktivitet",
    companyId: "",
    companyName: "Ett företag",
    timeReportRows: [
      {
        date: new Date(),
        prettyDate: format(new Date(), timeReportDateFormat),
        hours: "5"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "3"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "3"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "1"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "0.3"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "1.3"
      },
      {
        date: new Date(),
        prettyDate: "",
        hours: "1.9"
      }
    ]
  }
];
 */

const initialTimeReportRows: TimeReport[] = []

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
  const [filteredTimeReportRows, setFilteredTimeReportRows] = useState(
    initialTimeReportRows
  );
  const initialActivitySelect: ActivitySelectOptions[] = [];
  const [activitySelectOptions, setActivitySelectOptions] = useState(initialActivitySelect);
  const initialTotal: TimeReportSummary = {
    total: 0,
    rowTotals: [{total: 0}, {total: 0}, {total: 0}, {total: 0}, {total: 0}, {total: 0}, {total: 0}]
  };
  const [total, setTotal] = useState(initialTotal);

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
    calculateTotals(filteredTimeReportRows);
    getAllAssignedActivities();
  }, []);

  const handleWeekChange = (direction: "prev" | "next"): void => {
    if (direction === "prev") {
      const newSelectedDate = subDays(selectedDate, 7);
      const newWeekStartDate = startOfWeek(newSelectedDate, {weekStartsOn: 1});
      const newWeekEndDate = endOfWeek(newSelectedDate, {weekStartsOn: 1});
      setSelectedDate(newWeekStartDate);
      getFirstAndLastDayOfWeek(newSelectedDate);
      getTimeReportRowsForCurrentWeek(newWeekStartDate, newWeekEndDate)
    } else {
      const newSelectedDate = addDays(selectedDate, 7);
      const newWeekStartDate = startOfWeek(newSelectedDate, {weekStartsOn: 1});
      const newWeekEndDate = endOfWeek(newSelectedDate, {weekStartsOn: 1});
      setSelectedDate(startOfWeek(newSelectedDate, {weekStartsOn: 1}));
      getFirstAndLastDayOfWeek(newSelectedDate);
      getTimeReportRowsForCurrentWeek(newWeekStartDate, newWeekEndDate)
    }
  };

  const onTimeReportRowChange = (
    event: ChangeEvent<HTMLInputElement>,
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => {
    if (timeReportIndex !== undefined && timeReportRowIndex !== undefined) {
      //https://github.com/immerjs/immer
      setFilteredTimeReportRows(
        produce(filteredTimeReportRows, draft => {
          draft[timeReportIndex].timeReportRows[timeReportRowIndex].hours =
            event.target.value;
        })
      );
      calculateTotals(produce(filteredTimeReportRows, draft => {
        draft[timeReportIndex].timeReportRows[timeReportRowIndex].hours =
          event.target.value;
      }))
    }
  };

  const getAllAssignedActivities = async (): Promise<void> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    const userActivities: ActivityCompanySelectOption[] | string = await getAllActivitiesAssignedToUser(authContext.uid);
    if (typeof userActivities !== "string") {
      setActivitySelectOptions(userActivities)
    }
  };

  const handleSelectChange = (option: ValueType<any>): void => {
    createTimeReportRow(option);
    removeActivityFromCombobox(option.value)
  };

  const createTimeReportRow = (activity: ActivityCompanySelectOption): void => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    const firstDayOfWeekDate: Date = selectedDate;
    const newTimeReportRow: TimeReport = {
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
    setFilteredTimeReportRows([...filteredTimeReportRows, newTimeReportRow]);
    setTimeReportRows([...timeReportRows, newTimeReportRow]);
    console.log(newTimeReportRow)
  };

  const removeActivityFromCombobox = (activityId: string): void => {
    setActivitySelectOptions([...activitySelectOptions.filter(activity => activity.value !== activityId)])
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

  const getTimeReportRowsForCurrentWeek = (startDate: Date, endDate: Date): void => {
    setFilteredTimeReportRows(timeReportRows.filter(timeReportRow => {
      console.log(timeReportRow.date, startDate)
      return isEqual(timeReportRow.date, startDate)
    }));
  };

  const saveRows = async (): Promise<void> => {
  };

  return (
    <ContentSection>
      <TimeReportWrapper
        handleWeekChange={handleWeekChange}
        dateSelectorValue={dateSelectorValue}
        selectedDate={selectedDate}
        timeReportRows={filteredTimeReportRows}
        onTimeReportRowChange={onTimeReportRowChange}
        selectOptions={activitySelectOptions}
        handleSelectChange={handleSelectChange}
        saveRows={saveRows}
        total={total}
      />
    </ContentSection>
  );
};

export default Time;
