import React, {FunctionComponent, Fragment} from "react";
import TimeCard from "./TimeCard";
import {TimeReportSummaryOverview} from "../../types/types";

interface TimeCardContainerProps {
  isDetailView: boolean;
  toggleDetailView: (employeeId: string) => void;
  timeReportOverviewData: TimeReportSummaryOverview[]
}

const TimeCardContainer: FunctionComponent<TimeCardContainerProps> = props => {
  const {isDetailView, toggleDetailView, timeReportOverviewData} = props;
  return (
    <Fragment>
      {timeReportOverviewData.map((userSummary: TimeReportSummaryOverview) => (
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
      ))}
    </Fragment>
  );
};

export default TimeCardContainer;
