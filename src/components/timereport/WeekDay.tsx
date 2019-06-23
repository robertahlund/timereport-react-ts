import React, {
  ReactNode,
  FunctionComponent,
  Fragment,
  ChangeEvent
} from "react";
import Input from "../general/Input";
import styled from "styled-components";
import {TimeReport, TimeReportRow} from "../../types/types";

interface WeekDayProps {
  timeReportRow: TimeReportRow;
  timeReportIndex: number;
  timeReportRowIndex: number;
  onTimeReportRowChange: (
    event: ChangeEvent<HTMLInputElement>,
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => void;
  saveSingleRow: (
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => Promise<void>;
}

const WeekDay: FunctionComponent<WeekDayProps> = props => {
  const {
    timeReportRow,
    timeReportIndex,
    timeReportRowIndex,
    onTimeReportRowChange
  } = props;
  return (
    <InputWrapper>
      <Input
        onFormChange={onTimeReportRowChange}
        type="text"
        width="68px"
        value={timeReportRow.hours}
        textAlign="right"
        timeReportRowIndex={timeReportRowIndex}
        timeReportIndex={timeReportIndex}
        fontWeight="300"
        saveSingleRow={props.saveSingleRow}
        disabled={timeReportRow.locked}
      />
    </InputWrapper>
  );
};

export default WeekDay;

const InputWrapper = styled.div`
  padding: 0 5px;
`;
