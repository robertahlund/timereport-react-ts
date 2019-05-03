import React, {ChangeEvent, Fragment, FunctionComponent} from "react";
import {ListHeader} from "../employees/EmployeeList";
import DateSelector from "./DateSelector";
import styled from "styled-components";
import {DateSelectorValue, TimeReport, TimeReportRow, TimeReportSummary} from "./Time";
import WeekDateRow, {Row} from "./WeekDateRow";
import {FieldWrapper, Row as SummaryRowWhite} from "./WeekRow"
import {TextWrapper, WeekRow} from "./WeekRow";
import Select from "react-select";
import {ActivitySelectOptions} from "../companies/CompanyModal";
import {ValueType} from "react-select/lib/types";
import Button, {ButtonItem} from "../general/Button";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import TimeReportLoading from "./TimeReportLoading";
import LoadingIcon from "../../Icons/LoadingIcon";

const TimeReportListHeader = styled(ListHeader)`
  justify-content: flex-end;
`;

const SummaryRow = styled(SummaryRowWhite)`
  background-color: #F7F7F7;
  border: 2px solid #fff;
  border-top: none;
`;

interface ActivityRowProps {
  lastSaved: string;
}

const ActivityRow = styled(Row)`
  border: none;
  background-color: transparent;
  padding-right: 0;
  padding-left: 0;
  justify-content: ${(props: ActivityRowProps) => props.lastSaved ? "space-between" : "flex-end"};
  button${ButtonItem} {
    margin: 0;
  }
`;

const SummaryWrapper = styled(TextWrapper)`
  align-items: flex-start;
  width: 100px;
  font-weight: 500;
`;

const TextWrapperSummary = styled(SummaryWrapper)`
  align-items: flex-end;
  padding: 0 12.5px;
  width: 75px;
  font-weight: 400;
`;

const LastSaved = styled.span`
  font-size: 15px;
`;

const LastSavedTimeStamp = styled.span`
  font-weight: 500;
`;

const EmptyRow = styled(SummaryRowWhite)`
  font-size: 15px;
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
  selectOptions: ActivitySelectOptions[];
  handleSelectChange: (option: ValueType<any>) => void;
  saveRows: () => Promise<void>;
  total: TimeReportSummary;
  lastSaved: string;
  timeReportLoading: boolean;
  deleteRow: (timeReport: TimeReport) => Promise<void>;
}

const TimeReportWrapper: FunctionComponent<TimeReportWrapperProps> = props => {
  const {timeReportRows, selectOptions, handleSelectChange, total, lastSaved, timeReportLoading} = props;
  return (
    <Fragment>
      <TimeReportListHeader>
        <DateSelector
          handleWeekChange={props.handleWeekChange}
          dateSelectorValue={props.dateSelectorValue}
        />
      </TimeReportListHeader>
      <WeekDateRow selectedDate={props.selectedDate}/>
      <ReactCSSTransitionGroup
        transitionName="modal-transition"
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
      >
        {timeReportLoading ? (<TimeReportLoading/>) : (
          <Fragment>
            {timeReportRows.length > 0 ? (
              <Fragment>
              {timeReportRows.map((timeReport, index) => (
                  <WeekRow
                    timeReport={timeReport}
                    key={index}
                    timeReportIndex={index}
                    onTimeReportRowChange={props.onTimeReportRowChange}
                    deleteRow={props.deleteRow}
                  />
                ))}
              </Fragment>
            ) : (
              <EmptyRow>No data for this week.</EmptyRow>
            )}
          </Fragment>
        )}
      </ReactCSSTransitionGroup>
      <SummaryRow>
        {timeReportLoading ? (
          <LoadingIcon
            position="relative"
            left="0"
            height="18px"
            width="18px"
            color="#393e41"
          />
        ) : (
          <Fragment>
            <SummaryWrapper>Total: {total.total}h</SummaryWrapper>
            <FieldWrapper>
              {total.rowTotals.map((totalRow, index) => <TextWrapperSummary
                key={index}>{totalRow.total}</TextWrapperSummary>)}
            </FieldWrapper>
          </Fragment>
        )}
      </SummaryRow>
      <ActivityRow lastSaved={lastSaved}>
        {lastSaved && <LastSaved>Last saved <LastSavedTimeStamp>{lastSaved}</LastSavedTimeStamp></LastSaved>}
        <Select onChange={handleSelectChange} options={selectOptions} placeholder="Select Activity"
                value={null} classNamePrefix="react-select-time" className="react-select-time"/>
      </ActivityRow>
      <Button type="button" text="Test save" onSubmit={props.saveRows}/>
    </Fragment>
  );
};

export default TimeReportWrapper;
