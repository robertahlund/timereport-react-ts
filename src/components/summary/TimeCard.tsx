import React, {FunctionComponent, Fragment} from "react";
import styled from "styled-components";

interface TimeCardProps {
  isDetailedView: boolean;
  hoursWorked: number;
  employeeName?: string;
  employeeId: string;
  activityName?: string;
  companyName?: string;
  toggleDetailView: (employeeId: string) => void;
}

const TimeCard: FunctionComponent<TimeCardProps> = props => {
  const {isDetailedView, hoursWorked, employeeName, activityName, companyName, employeeId, toggleDetailView} = props;
  return (
    hoursWorked > 0 ? (
      <Card>
        <CardHeader/>
        <DataWrapper>
          <HoursWorked>{hoursWorked}h</HoursWorked>
          {!isDetailedView ? (
            <Fragment>
              <EmployeeName>{employeeName}</EmployeeName>
              <DetailLink onClick={() => toggleDetailView(employeeId)}>View detailed report</DetailLink>
            </Fragment>
          ) : (
            <Fragment>
              <ActivityName>{activityName}</ActivityName>
              <CompanyName>{companyName}</CompanyName>
            </Fragment>
          )}
        </DataWrapper>
      </Card>
    ) : null
  );
};

export default TimeCard;

const Card = styled.div`
  border-radius: 3px;
  width: calc(20% - 15px);
  min-width: 180px;
  margin: 7.5px;
  background-color: #F7F7F7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px 0;
`;

export const CardHeader = styled.div`
  background-color: #fec861;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  height: 10px;
  width: 100%;
`;

const HoursWorked = styled.span`
  font-size: 30px;
  margin-bottom: 20px;
`;

const EmployeeName = styled.span`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ActivityName = styled(EmployeeName)`
  margin-bottom: 5px;
`;

const CompanyName = styled(EmployeeName)`
  margin-bottom: 0;
`;

const DetailLink = styled.span`
  font-size: 14px;
  color: #fec861;
  cursor: pointer;
`;