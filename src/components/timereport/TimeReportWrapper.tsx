import React, { ChangeEvent, Fragment, FunctionComponent } from "react";
import { ListHeader } from "../employees/EmployeeList";
import DateSelector from "./DateSelector";
import styled from "styled-components";
import { DateSelectorValue, TimeReport, TimeReportRow } from "./Time";
import WeekDateRow from "./WeekDateRow";
import { WeekRow } from "./WeekRow";

const TimeReportListHeader = styled(ListHeader)`
  justify-content: flex-end;
`;

interface TimeReportWrapperProps {
  handleWeekChange: (direction: "prev" | "next") => void;
  dateSelectorValue: DateSelectorValue;
  selectedDate: Date;
  timeReportRows: TimeReport[];
  onTimeReportRowChange: (
    event: ChangeEvent<HTMLInputElement>,
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => void;
}

const TimeReportWrapper: FunctionComponent<TimeReportWrapperProps> = props => {
  const { timeReportRows } = props;
  return (
    <Fragment>
      <TimeReportListHeader>
        <DateSelector
          handleWeekChange={props.handleWeekChange}
          dateSelectorValue={props.dateSelectorValue}
        />
      </TimeReportListHeader>
      <WeekDateRow selectedDate={props.selectedDate} />
      {timeReportRows.map((timeReport, index) => (
        <WeekRow
          timeReport={timeReport}
          key={index}
          timeReportIndex={index}
          onTimeReportRowChange={props.onTimeReportRowChange}
        />
      ))}
    </Fragment>
  );
};

export default TimeReportWrapper;
