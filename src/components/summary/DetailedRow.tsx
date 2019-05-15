import React, {FunctionComponent} from "react";
import styled from "styled-components";

interface DetailedRowProps {
  activityName: string;
  companyName: string;
  hoursWorked: number;
  formatedDate: string;
}

const DetailedRow: FunctionComponent<DetailedRowProps> = props => {
  const {activityName, companyName, hoursWorked, formatedDate} = props;
  return (
    <Row>
      <DataText>{activityName}</DataText>
      <DataText>{companyName}</DataText>
      <DataText>{hoursWorked}h</DataText>
      <DataText>{formatedDate}</DataText>
    </Row>
  )
};

export default DetailedRow;

const Row = styled.div`
  background-color: #fff;
  border-radius: 3px;
  padding: 15px;
  margin: 15px;
  display: flex;
  justify-content: space-between;
`;

const DataText = styled.span`
  width: 35%;
  &:nth-child(3) {
    width: 10%;
  }
  &:last-child {
    text-align: right;
    width: 20%
  }
`;