import React, {FunctionComponent, Fragment} from "react";
import TimeCard from "./TimeCard";
import {TimeReportSummaryOverview} from "../../types/types";
import styled from "styled-components";

interface TimeCardContainerProps {
  isDetailView: boolean;
  toggleDetailView: (employeeId: string) => void;
  timeReportOverviewData: TimeReportSummaryOverview[]
}

interface EmptyMessageProps {
  isDetailView: boolean;
}

const TimeCardContainer: FunctionComponent<TimeCardContainerProps> = props => {
  const {isDetailView, toggleDetailView, timeReportOverviewData} = props;
  return (
    timeReportOverviewData.length === 0 ? (
      <EmptyMessage isDetailView={isDetailView}>
        <p>No data for this month.</p>
      </EmptyMessage>
    ) : (
      <Fragment>
        {timeReportOverviewData.map((userSummary: TimeReportSummaryOverview) => (
          <Fragment>
            <TimeCard
              hoursWorked={userSummary.totalHours}
              toggleDetailView={toggleDetailView}
              isDetailedView={isDetailView}
              employeeName={userSummary.username}
              employeeId={userSummary.userId}
              key={userSummary.userId}
              activityName={userSummary.activityName}
              companyName={userSummary.companyName}
            />
          </Fragment>
        ))}
      </Fragment>
    )
  );
};

export default TimeCardContainer;

const EmptyMessage = styled.div`
  padding-left: 5px;
  p {
    ${(props: EmptyMessageProps) => props.isDetailView ? "margin: 10px 0 7.5px 0" : "inherit"}
  }
`;
