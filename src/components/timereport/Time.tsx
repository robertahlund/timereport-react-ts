import React, {FunctionComponent, useEffect, useState} from 'react';
import {ContentSection} from "../employees/Employees";
import TimeReportWrapper from "./TimeReportWrapper";
import {addDays, endOfWeek, format, startOfWeek, subDays} from "date-fns";

export interface DateSelectorValue {
  from: string;
  to: string;
}

type DateSelectorStartValueFormat = "MMM[ ]D";
type DateSelectorEndValueFormat = "[ - ]MMM[ ]D[, ]YYYY";
export const DateSelectorStartValueFormat: DateSelectorStartValueFormat = "MMM[ ]D";
export const DateSelectorEndValueFormat: DateSelectorEndValueFormat = "[ - ]MMM[ ]D[, ]YYYY";

const Time: FunctionComponent = () => {
  const [selectedDate, setSelectedDate] = useState(startOfWeek(new Date(), {weekStartsOn: 1}));
  const initialDateSelectorValue: DateSelectorValue = {
    from: format(selectedDate, DateSelectorStartValueFormat),
    to: format(selectedDate, DateSelectorEndValueFormat)
  };
  const [dateSelectorValue, setDateSelectorValue] = useState(initialDateSelectorValue);

  const getFirstAndLastDayOfWeek = (date: Date) => {
    const dateSelectorValue: DateSelectorValue = {
      from: format(startOfWeek(date, {weekStartsOn: 1}), DateSelectorStartValueFormat),
      to: format(endOfWeek(date, {weekStartsOn: 1}), DateSelectorEndValueFormat)
    };
    setDateSelectorValue(dateSelectorValue)
  };

  useEffect(() => {
    getFirstAndLastDayOfWeek(selectedDate);
  }, []);

  const handleWeekChange = (direction: "prev" | "next"): void => {
    if (direction === "prev") {
      const newSelectedDate = subDays(selectedDate, 7);
      setSelectedDate(startOfWeek(newSelectedDate, {weekStartsOn: 1}));
      getFirstAndLastDayOfWeek(newSelectedDate);
    } else {
      const newSelectedDate = addDays(selectedDate, 7);
      setSelectedDate(startOfWeek(newSelectedDate, {weekStartsOn: 1}));
      getFirstAndLastDayOfWeek(newSelectedDate);
    }
    console.log(selectedDate)
  };

  return (
    <ContentSection>
      <TimeReportWrapper
        handleWeekChange={handleWeekChange}
        dateSelectorValue={dateSelectorValue}
        selectedDate={selectedDate}
      />
    </ContentSection>
  );
};

export default Time;