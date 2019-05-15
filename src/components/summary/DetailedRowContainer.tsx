import React, {FunctionComponent, ReactNode, Fragment} from "react";
import DetailedRow from "./DetailedRow";
import styled from "styled-components";
import {CardHeader} from "./TimeCard";

interface DetailedRowContainerProps {

}

const DetailedRowContainer: FunctionComponent<DetailedRowContainerProps> = props => {
  const sampleData = (): ReactNode[] => {
    const data: ReactNode[] = [];
    for(let i = 0; i<10; i++) {
      data.push(<DetailedRow hoursWorked={5} activityName="Activity 1" companyName="Company 1" formatedDate="2019-04-01" key={i}/>)
    }
    return data;
  };

  return (
    <RowWrapper>
      <CardHeader/>
    {sampleData()}
    </RowWrapper>
  )
};

export default DetailedRowContainer;

const RowWrapper = styled.div`
  background-color: #F7F7F7;
  margin: 20px 5px;
  width: 100%;
  border-radius: 3px;
`;