import React, {
  ReactNode,
  FunctionComponent,
  Fragment,
  ChangeEvent
} from "react";
import { WeekDay } from "./WeekDay";
import { TimeReport } from "./Time";
import styled from "styled-components";

interface WeekRowProps {
  timeReport: TimeReport;
  timeReportIndex: number;
  onTimeReportRowChange: (
    event: ChangeEvent<HTMLInputElement>,
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => void;
}

const Row = styled.div`
  background-color: #fff;
  padding: 10px 5px 10px 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f7f7f7;
`;

const Activity = styled.span`
  font-weight: 500;
`;

const Company = styled.span`
  font-weight: 300;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 15px;
`;

const FieldWrapper = styled.div`
  display: flex;
`;

export const WeekRow: FunctionComponent<WeekRowProps> = props => {
  const { timeReport, timeReportIndex, onTimeReportRowChange } = props;
  return (
    <Row>
      <TextWrapper>
        <Activity>{timeReport.activityName}</Activity>
        <Company>{timeReport.companyName}</Company>
      </TextWrapper>
      <FieldWrapper>
        {timeReport.timeReportRows.map((timeReportRow, index) => (
          <WeekDay
            timeReportRow={timeReportRow}
            key={index}
            onTimeReportRowChange={onTimeReportRowChange}
            timeReportIndex={timeReportIndex}
            timeReportRowIndex={index}
          />
        ))}
      </FieldWrapper>
    </Row>
  );
};
