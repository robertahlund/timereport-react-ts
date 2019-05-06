import React, { ChangeEvent, Fragment, FunctionComponent } from "react";
import { ListHeader } from "../employees/EmployeeList";
import DateSelector from "./DateSelector";
import styled from "styled-components";
import WeekDateRow, { Row } from "./WeekDateRow";
import { FieldWrapper, Row as SummaryRowWhite } from "./WeekRow";
import WeekRow, { TextWrapper } from "./WeekRow";
import Select from "react-select";
import { ValueType } from "react-select/lib/types";
import Button, { ButtonItem } from "../general/Button";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import TimeReportLoading from "./TimeReportLoading";
import LoadingIcon from "../../Icons/LoadingIcon";
import {ActivityCompanySelectOption, DateSelectorValue, TimeReport, TimeReportSummary} from "../../types/types";

interface ActivityRowProps {
  lastSaved: string;
}

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
  selectOptions: ActivityCompanySelectOption[];
  handleSelectChange: (option: ValueType<any>) => void;
  saveRows: () => Promise<void>;
  total: TimeReportSummary;
  lastSaved: string;
  timeReportLoading: boolean;
  deleteRow: (timeReport: TimeReport) => Promise<void>;
  saveSingleRow: (
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => Promise<void>;
}

const TimeReportWrapper: FunctionComponent<TimeReportWrapperProps> = props => {
  const {
    timeReportRows,
    selectOptions,
    handleSelectChange,
    total,
    lastSaved,
    timeReportLoading
  } = props;
  return (
    <Fragment>
      <TimeReportListHeader>
        <DateSelector
          handleWeekChange={props.handleWeekChange}
          dateSelectorValue={props.dateSelectorValue}
        />
      </TimeReportListHeader>
      <WeekDateRow selectedDate={props.selectedDate} />
      <ReactCSSTransitionGroup
        transitionName="modal-transition"
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
      >
        {timeReportLoading ? (
          <TimeReportLoading />
        ) : (
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
                    saveSingleRow={props.saveSingleRow}
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
            <SummaryWrapper>Total: {Math.round(total.total * 100) / 100}h</SummaryWrapper>
            <FieldWrapper>
              {total.rowTotals.map((totalRow, index) => (
                <TextWrapperSummary key={index}>
                  {Math.round(totalRow.total * 100) / 100}
                </TextWrapperSummary>
              ))}
            </FieldWrapper>
          </Fragment>
        )}
      </SummaryRow>
      <ActivityRow lastSaved={lastSaved}>
        {lastSaved && (
          <LastSaved>
            Last saved <LastSavedTimeStamp>{lastSaved}</LastSavedTimeStamp>
          </LastSaved>
        )}
        <Select
          onChange={handleSelectChange}
          options={selectOptions}
          placeholder="Select Activity"
          value={null}
          classNamePrefix="react-select-time"
          className="react-select-time"
        />
      </ActivityRow>
    </Fragment>
  );
};

export default TimeReportWrapper;

const TimeReportListHeader = styled(ListHeader)`
  justify-content: flex-end;
`;

const SummaryRow = styled(SummaryRowWhite)`
  background-color: #f7f7f7;
  border: 2px solid #fff;
  border-top: none;
`;

const ActivityRow = styled(Row)`
  border: none;
  background-color: transparent;
  padding-right: 0;
  padding-left: 0;
  justify-content: ${(props: ActivityRowProps) =>
  props.lastSaved ? "space-between" : "flex-end"};
  button${ButtonItem} {
    margin: 0;
  }
`;

const SummaryWrapper = styled(TextWrapper)`
  align-items: flex-start;
  width: 150px;
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