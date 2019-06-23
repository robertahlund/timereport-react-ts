import React, {FunctionComponent} from 'react';
import styled from "styled-components";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import {DateSelectorValue} from "../../types/types";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enGB from "date-fns/locale/en-GB"

registerLocale('enGB', enGB);

interface DateSelectorProps {
  handleWeekChange: (direction: "prev" | "next") => void;
  dateSelectorValue: DateSelectorValue;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  showMonths: boolean;
}

const DateSelector: FunctionComponent<DateSelectorProps> = props => {
  return (
    <DateSelectorWrapper>
      <DateSelectorButton onClick={() => props.handleWeekChange("prev")} type="button">
        <ArrowLeftIcon width="24px" height="24px" color="#393e41"/>
      </DateSelectorButton>
      <DatePickerWrapper>
        <DatePicker onChange={props.onDateSelect} customInput={
          <DateSelectorValueContainer>{props.dateSelectorValue.from}{props.dateSelectorValue.to}</DateSelectorValueContainer>
        } todayButton={"Today"} selected={props.selectedDate} showWeekNumbers locale="enGB"
                    showMonthYearPicker={props.showMonths}/>
      </DatePickerWrapper>
      <DateSelectorButton onClick={() => props.handleWeekChange("next")} type="button">
        <ArrowRightIcon width="24px" height="24px" color="#393e41"/>
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

export const DatePickerWrapper = styled.div`
  .react-datepicker {
    font-family: 'Roboto', sans-serif;
    border-radius: 3px;
    border: 1px solid #00000014;
  }
  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle, .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before {
    border-top: none;
    border-bottom-color: #F7F7F7;
  }
  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle {
    top: 0;
    margin-top: -7px;
}
  //header
  .react-datepicker__header {
    background-color: #F7F7F7;
    border-bottom: 1px solid #fff;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  .react-datepicker-year-header {
    padding-top: 18px!important;
    padding-bottom: 18px!important;
  }
  //day name
  .react-datepicker__day-name {
    font-weight: 400;
  }
  //day and weeknumber
  .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name, .react-datepicker__week-number {
    padding: 5px;
    font-weight: 400;
    font-size: 14px;
  }
  //month selector
  .react-datepicker__month .react-datepicker__month-text {
    display: inline-block;
    width: 4rem;
    margin: 2px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: 400;
    font-size: 14px;
  }
  //active month
  .react-datepicker__month--selected, .react-datepicker__month--in-selecting-range, .react-datepicker__month--in-range {
    background: #FEC861;
    color: #393E41;
  }
  //current day
  .react-datepicker__day--today, .react-datepicker__month-text--today {
    font-weight: 600;
  }
  .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
    margin-top: 0;
    color: #393E41;
    font-weight: 500;
    font-size: 0.944rem;
    padding: 10px 0;
  }
  //next/previous arrows
  .react-datepicker__navigation {
    top: 20px;
  }
  .react-datepicker__navigation--previous {
    border-right-color: #393E41;
  }
  .react-datepicker__navigation--previous:hover {
    border-right-color: #393E41;
  }
  .react-datepicker__navigation--next {
    border-left-color: #393E41;
  }
  .react-datepicker__navigation--next:hover {
    border-left-color: #393E41;
  }
  .react-datepicker__today-button {
    background: #FEC861;
    border-top: none;
    cursor: pointer;
    text-align: center;
    font-weight: 400;
    padding: 10px 0;
    clear: left;
    font-size: 14px;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range {
    border-radius: 3px;
    background-color: #FEC861;
    color: #393E41;
  }
  .react-datepicker__day--selected:hover, .react-datepicker__day--in-selecting-range:hover, .react-datepicker__day--in-range:hover, .react-datepicker__month-text--selected:hover, .react-datepicker__month-text--in-selecting-range:hover, .react-datepicker__month-text--in-range:hover {
    background-color: #FEC861;
  }
  .react-datepicker__month-text.react-datepicker__month--selected:hover, .react-datepicker__month-text.react-datepicker__month--in-range:hover {
    background-color: #FEC861;
  }
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
