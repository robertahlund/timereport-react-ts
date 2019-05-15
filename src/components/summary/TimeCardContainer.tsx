import React, {FunctionComponent, ReactNode, Fragment} from "react";
import styled from "styled-components";
import TimeCard from "./TimeCard";

interface TimeCardContainerProps {
  isDetailView: boolean;
  toggleDetailView: (employeeId: string) => void;
}

const TimeCardContainer: FunctionComponent<TimeCardContainerProps> = props => {
  const {isDetailView, toggleDetailView} = props;
  const sampleData = (): ReactNode[] => {
    const timeCards: ReactNode[] = [];
    for (let i = 0; i < 10; i++) {
      timeCards.push(<TimeCard
        hoursWorked={155}
        toggleDetailView={toggleDetailView}
        isDetailedView={isDetailView}
        activityName="Activity"
        companyName="Company"
        employeeName="Employee name"
        employeeId={String(i)}
        key={i}
      />)
    }
    return timeCards;
  };

  return (
    <Fragment>
      {sampleData()}
    </Fragment>
  );
};

export default TimeCardContainer;
