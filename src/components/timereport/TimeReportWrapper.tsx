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
import TimeReportLoading from "./TimeReportLoading";
import LoadingIcon from "../../icons/LoadingIcon";
import {
  DateSelectorValue,
  GroupedActivityOptions,
  TimeReport,
  TimeReportSummary
} from "../../types/types";

interface ActivityRowProps {
  lastSaved?: string | boolean;
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
  selectOptions: GroupedActivityOptions[];
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
  onDateSelect: (date: Date) => void;
  getRowsFromPreviousWeek: () => Promise<void>;
  previousWeekRowLoading: boolean;
}

const TimeReportWrapper: FunctionComponent<TimeReportWrapperProps> = props => {
  const {
    timeReportRows,
    selectOptions,
    handleSelectChange,
    total,
    lastSaved,
    timeReportLoading,
    selectedDate
  } = props;

  const formatGroupLabel = (data: any) => {
    return (
      <GroupStyles>
        <GroupBadgeStyles>{data.label}</GroupBadgeStyles>
        <GroupBadgeStyles>{data.options.length}</GroupBadgeStyles>
      </GroupStyles>
    );
  };

  return (
    <Fragment>
      <TimeReportListHeader>
        <DateSelector
          handleWeekChange={props.handleWeekChange}
          dateSelectorValue={props.dateSelectorValue}
          selectedDate={selectedDate}
          onDateSelect={props.onDateSelect}
          showMonths={false}
        />
      </TimeReportListHeader>
      <WeekDateRow selectedDate={props.selectedDate} />
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
            <SummaryWrapper>
              Total: {Math.round(total.total * 100) / 100}h
            </SummaryWrapper>
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
      <ActivityRow
        lastSaved={
          lastSaved || (timeReportRows.length === 0 && !timeReportLoading)
        }
      >
        {timeReportRows.length === 0 && !timeReportLoading ? (
          <Button
            onSubmit={props.getRowsFromPreviousWeek}
            text="Copy rows from previous week"
            type="button"
            loading={props.previousWeekRowLoading}
            buttonType="Create"
          />
        ) : null}
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
          formatGroupLabel={formatGroupLabel}
        />
      </ActivityRow>
    </Fragment>
  );
};

export default TimeReportWrapper;

export const TimeReportListHeader = styled(ListHeader)`
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

export const GroupBadgeStyles = styled.span`
  color: #393e41;
  font-size: 14px;
  margin: 0;
  padding: 5px 0;
`;

export const GroupStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  ${GroupBadgeStyles}:last-child {
    background-color: #fec861;
    padding: 5px;
    border-radius: 3px;
  }
`;
