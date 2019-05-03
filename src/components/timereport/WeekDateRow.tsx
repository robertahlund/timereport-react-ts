import React, {FunctionComponent, Fragment, ReactNode} from 'react';
import styled from "styled-components";
import {addDays, format} from "date-fns";

interface WeekDateRowProps {
  selectedDate: Date;
}

export const Row = styled.div`
  background-color: #F7F7F7;
  border: 2px solid #fff;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

const Day = styled.span`
  font-weight: 500;
`;

const Date = styled.span`
  font-weight: 300;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100px;
  font-size: 15px;
`;

const WeekDateRow: FunctionComponent<WeekDateRowProps> = props => {

  const buildWeekDates = (): ReactNode[] => {
    const dateList: ReactNode[] = [];
    const initialDate = props.selectedDate;
    for (let i = 0; i <= 6; i++) {
      const dateItem =
        <DateContainer key={i}>
          <Day>{format(addDays(initialDate, i), "ddd")}</Day>
          <Date>{format(addDays(initialDate, i), "MMM[ ]D")}</Date>
        </DateContainer>;
      dateList.push(dateItem)
    }
    return dateList;
  };

  return (
    <Row>
      {buildWeekDates()}
    </Row>
  );
};

export default WeekDateRow;