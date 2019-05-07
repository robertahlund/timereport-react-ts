import React, {FunctionComponent} from 'react';
import styled from "styled-components";
import ArrowLeft from "../../Icons/ArrowLeft";
import ArrowRight from "../../Icons/ArrowRight";
import {DateSelectorValue} from "../../types/types";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// @ts-ignore
import enGB from "date-fns/locale/en-GB"

registerLocale('enGB', enGB);

interface DateSelectorProps {
  handleWeekChange: (direction: "prev" | "next") => void;
  dateSelectorValue: DateSelectorValue;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DateSelector: FunctionComponent<DateSelectorProps> = props => {
  return (
    <DateSelectorWrapper>
      <DateSelectorButton onClick={() => props.handleWeekChange("prev")} type="button">
        <ArrowLeft width="24px" height="24px" color="#393e41"/>
      </DateSelectorButton>
      <DatePicker onChange={props.onDateSelect} customInput={
        <DateSelectorValueContainer>{props.dateSelectorValue.from}{props.dateSelectorValue.to}</DateSelectorValueContainer>
      } todayButton={"Today"} selected={props.selectedDate} showWeekNumbers locale="enGB"/>
      <DateSelectorButton onClick={() => props.handleWeekChange("next")} type="button">
        <ArrowRight width="24px" height="24px" color="#393e41"/>
      </DateSelectorButton>
    </DateSelectorWrapper>
  );
};

export default DateSelector;

const DateSelectorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DateSelectorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F7F7F7;
  height: 34px;
  border-radius: 3px;
  padding: 0 5px;
  cursor: pointer;
  border: none;
`;

const DateSelectorValueContainer = styled.div`
  background-color: #F7F7F7;
  height: 34px;
  width: 200px;
  border-radius: 3px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  cursor: pointer;
`;
