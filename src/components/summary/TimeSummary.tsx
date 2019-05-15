import React, {ChangeEvent, FunctionComponent, useEffect, useState} from "react";
import {ContentSection} from "../employees/Employees";
import TimeSummarySearch from "./TimeSummarySearch";
import DateSelector from "../timereport/DateSelector";
import {TimeReportListHeader} from "../timereport/TimeReportWrapper";
import {addDays, addMonths, endOfWeek, format, startOfWeek, subDays, subMonths} from "date-fns";
import {getFirstAndLastDateOfMonth} from "../../utilities/date/dateUtilities";
import {
  dateSelectorEndValueFormat,
  dateSelectorStartValueFormat,
  initialDateSelectorValue
} from "../../constants/timeReportConstants";
import {DateSelectorValue, TimeReport, TimeReportRow, TimeReportSummaryOverview} from "../../types/types";
import TimeCardContainer from "./TimeCardContainer";
import styled from "styled-components";
import DetailedRowContainer from "./DetailedRowContainer";
import Button from "../general/Button";
import ArrowLeft from "../../icons/ArrowLeft";
import {getTimeReportsByDate} from "../../api/timeReportApi";
import {toast} from "react-toastify";
import {Dictionary} from "lodash";
import _ from "lodash";

interface TimeSummaryListHeaderProps {
  showDetailView: boolean;
}

const TimeSummary: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetailView, setShowDetailView] = useState(false);
  const [dateSelectorValue, setDateSelectorValue] = useState(
    initialDateSelectorValue
  );

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    onDateSelect(new Date());
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    //TODO filter list
    setSearchValue(event.target.value)
  };

  const handleWeekChange = async (direction: "prev" | "next"): Promise<void> => {
    if (direction === "prev") {
      const newSelectedDate: Date = subMonths(selectedDate, 1);
      const firstDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).first;
      const lastDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).last;
      const dateSelectorValue: DateSelectorValue = {
        from: format(firstDayOfMonth, dateSelectorStartValueFormat),
        to: format(lastDayOfMonth, dateSelectorEndValueFormat)
      };
      setSelectedDate(firstDayOfMonth);
      setDateSelectorValue(dateSelectorValue)
    } else {
      const newSelectedDate: Date = addMonths(selectedDate, 1);
      const firstDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).first;
      const lastDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).last;
      const dateSelectorValue: DateSelectorValue = {
        from: format(firstDayOfMonth, dateSelectorStartValueFormat),
        to: format(lastDayOfMonth, dateSelectorEndValueFormat)
      };
      setSelectedDate(firstDayOfMonth);
      setDateSelectorValue(dateSelectorValue)
    }
  };

  const onDateSelect = async (date: Date): Promise<void> => {
    const newSelectedDate: Date = date;
    const firstDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).first;
    const lastDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).last;
    const dateSelectorValue: DateSelectorValue = {
      from: format(firstDayOfMonth, dateSelectorStartValueFormat),
      to: format(lastDayOfMonth, dateSelectorEndValueFormat)
    };
    setSelectedDate(getFirstAndLastDateOfMonth(newSelectedDate).first);
    setDateSelectorValue(dateSelectorValue);
    const timeReports: Dictionary<TimeReport[]> | string = await getTimeReportsByDate(firstDayOfMonth, lastDayOfMonth);
    if (typeof timeReports !== "string") {
      calculateTimeReportTotals(timeReports);
    } else {
      toast.error("Error retrieving data.")
    }
  };

  const calculateTimeReportTotals = (timeReports: Dictionary<TimeReport[]>): TimeReportSummaryOverview[] => {
    const timeReportOverviewData: TimeReportSummaryOverview[] = [];
    _.forEach(timeReports, (value, key) => {
      let total: number = 0;
      console.log(timeReports[key])
      _.forEach(timeReports[key], timeReportRow => {
        console.log(timeReportRow)
        total += _.sumBy(timeReportRow.timeReportRows, (row: TimeReportRow) => +row.hours);
        console.log(total)
      })
      timeReportOverviewData.push({
        employeeId: key,
        employeeName: "todo todo",
        totalHours: total
      })
    })
    console.log(timeReportOverviewData)
    return timeReportOverviewData;
  };

  const toggleDetailView = (employeeId?: string): void => {
    console.log(employeeId)
    if (employeeId) {
      setShowDetailView(true);
    } else {
      setShowDetailView(false);
    }
  };

  return (
    <ContentSection>
      {!showDetailView && (
        <TimeSummarySearch
          searchValue={searchValue}
          onSearchChange={handleSearchChange}/>
      )}
      <TimeSummaryListHeader showDetailView={showDetailView}>
        {showDetailView && (
          <Back onClick={() => toggleDetailView()}>
            <ArrowLeft width="24px" height="24px"/>
            <span>Go back</span>
          </Back>
        )}
        <DateSelector
          handleWeekChange={handleWeekChange}
          dateSelectorValue={dateSelectorValue}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          showMonths={true}
        />
      </TimeSummaryListHeader>
      <Wrapper>
        <TimeCardContainer isDetailView={showDetailView} toggleDetailView={toggleDetailView}/>
        {showDetailView && (
          <DetailedRowContainer/>
        )}
      </Wrapper>
    </ContentSection>
  )
};

export default TimeSummary;

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 10px;
`;

const TimeSummaryListHeader = styled(TimeReportListHeader)`
  justify-content: ${(props: TimeSummaryListHeaderProps) => props.showDetailView ? "space-between" : "flex-end"};
`;

const Back = styled.div`
  background-color: #fff;
  display: flex;
  align-items: center;
  border-radius: 3px;
  padding: 0 5px;
  span {
    width: inherit;
    text-align: left;
    padding: 0 10px 0 5px;
  }
`;