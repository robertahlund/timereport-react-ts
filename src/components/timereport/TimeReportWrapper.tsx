import React, {Fragment, FunctionComponent} from 'react';
import {ListHeader} from "../employees/EmployeeList";
import DateSelector from "./DateSelector";
import styled from "styled-components";
import {DateSelectorValue} from "./Time";
import WeekDateRow from "./WeekDateRow";

const TimeReportListHeader = styled(ListHeader)`
  justify-content: flex-end;
`;

interface TimeReportWrapperProps {
  handleWeekChange: (direction: "prev" | "next") => void;
  dateSelectorValue: DateSelectorValue;
  selectedDate: Date;
}

const TimeReportWrapper: FunctionComponent<TimeReportWrapperProps> = props => {
  return (
    <Fragment>
      <TimeReportListHeader>
        <DateSelector handleWeekChange={props.handleWeekChange} dateSelectorValue={props.dateSelectorValue}/>
      </TimeReportListHeader>
      <WeekDateRow selectedDate={props.selectedDate}/>
    </Fragment>
  );
};

export default TimeReportWrapper;