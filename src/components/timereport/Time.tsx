import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import { ContentSection } from "../employees/Employees";
import TimeReportWrapper from "./TimeReportWrapper";
import { addDays, endOfWeek, format, startOfWeek, subDays } from "date-fns";
import produce from "immer";

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
  activityId: string;
  activityName?: string;
  companyId: string;
  companyName?: string;
  timeReportRows: TimeReportRow[];
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
const FAKE_TIME_REPORT_ROWS: TimeReport[] = [
  {
    userId: "",
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

const Time: FunctionComponent = () => {
  const [selectedDate, setSelectedDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const initialDateSelectorValue: DateSelectorValue = {
    from: format(selectedDate, dateSelectorStartValueFormat),
    to: format(selectedDate, dateSelectorEndValueFormat)
  };
  const [dateSelectorValue, setDateSelectorValue] = useState(
    initialDateSelectorValue
  );
  const [timeReportRows, setTimeReportRows] = useState(FAKE_TIME_REPORT_ROWS);
  const [filteredTimeReportRows, setFilteredTimeReportRows] = useState(
    FAKE_TIME_REPORT_ROWS
  );

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

  useEffect(() => {
    getFirstAndLastDayOfWeek(selectedDate);
  }, []);

  const handleWeekChange = (direction: "prev" | "next"): void => {
    if (direction === "prev") {
      const newSelectedDate = subDays(selectedDate, 7);
      setSelectedDate(startOfWeek(newSelectedDate, { weekStartsOn: 1 }));
      getFirstAndLastDayOfWeek(newSelectedDate);
    } else {
      const newSelectedDate = addDays(selectedDate, 7);
      setSelectedDate(startOfWeek(newSelectedDate, { weekStartsOn: 1 }));
      getFirstAndLastDayOfWeek(newSelectedDate);
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
    }
  };

  return (
    <ContentSection>
      <TimeReportWrapper
        handleWeekChange={handleWeekChange}
        dateSelectorValue={dateSelectorValue}
        selectedDate={selectedDate}
        timeReportRows={filteredTimeReportRows}
        onTimeReportRowChange={onTimeReportRowChange}
      />
    </ContentSection>
  );
};

export default Time;
