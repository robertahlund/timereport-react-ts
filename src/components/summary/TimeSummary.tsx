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
import {initialTimeReportOverviewData} from "../../constants/summaryConstants";

interface TimeSummaryListHeaderProps {
  showDetailView: boolean;
}

const TimeSummary: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetailView, setShowDetailView] = useState(false);
  const [timeReportOverviewData, setTimeReportOverviewData] = useState(initialTimeReportOverviewData);
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
      setDateSelectorValue(dateSelectorValue);
      const timeReports: TimeReport[] | string = await getTimeReportsByDate(firstDayOfMonth, lastDayOfMonth);
      if (typeof timeReports !== "string") {
        const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(timeReports, "userId");
        calculateTimeReportTotals(formattedTimeReports);
      } else {
        toast.error("Error retrieving data.")
      }
    } else {
      const newSelectedDate: Date = addMonths(selectedDate, 1);
      const firstDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).first;
      const lastDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).last;
      const dateSelectorValue: DateSelectorValue = {
        from: format(firstDayOfMonth, dateSelectorStartValueFormat),
        to: format(lastDayOfMonth, dateSelectorEndValueFormat)
      };
      setSelectedDate(firstDayOfMonth);
      setDateSelectorValue(dateSelectorValue);
      const timeReports: TimeReport[] | string = await getTimeReportsByDate(firstDayOfMonth, lastDayOfMonth);
      if (typeof timeReports !== "string") {
        const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(timeReports, "userId");
        calculateTimeReportTotals(formattedTimeReports);
      } else {
        toast.error("Error retrieving data.")
      }
    }
  };

  const onDateSelect = async (date: Date, isDetailViewtoggled = false): Promise<void> => {
    const newSelectedDate: Date = date;
    const firstDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).first;
    const lastDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate).last;
    const dateSelectorValue: DateSelectorValue = {
      from: format(firstDayOfMonth, dateSelectorStartValueFormat),
      to: format(lastDayOfMonth, dateSelectorEndValueFormat)
    };
    setSelectedDate(getFirstAndLastDateOfMonth(newSelectedDate).first);
    setDateSelectorValue(dateSelectorValue);
    const timeReports: TimeReport[] | string = await getTimeReportsByDate(firstDayOfMonth, lastDayOfMonth);
    if (typeof timeReports !== "string") {
      if (isDetailViewtoggled) {
        const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(timeReports, report => {
          return `${report.activityId}-${report.companyId}`;
        });
        calculateActivityTotals(formattedTimeReports);
      } else {
        const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(timeReports, "userId");
        calculateTimeReportTotals(formattedTimeReports);
      }
    } else {
      toast.error("Error retrieving data.")
    }
  };

  const calculateTimeReportTotals = (timeReports: Dictionary<TimeReport[]>): TimeReportSummaryOverview[] => {
    const timeReportOverviewData: TimeReportSummaryOverview[] = [];
    _.forEach(timeReports, (value, key) => {
      let total: number = 0;
      let employeeName: string = "";
      _.forEach(timeReports[key], timeReportRow => {
        employeeName = timeReportRow.username;
        total += _.sumBy(timeReportRow.timeReportRows, (row: TimeReportRow) => +row.hours);
      });
      timeReportOverviewData.push({
        userId: key,
        username: employeeName,
        totalHours: total
      })
    });
    setTimeReportOverviewData(timeReportOverviewData);
    console.log(timeReportOverviewData);
    return timeReportOverviewData;
  };

  const calculateActivityTotals = (timeReports: Dictionary<TimeReport[]>): TimeReportSummaryOverview[] => {
    console.log(timeReports)
    const timeReportOverviewData: TimeReportSummaryOverview[] = [];
    _.forEach(timeReports, (value, key) => {
      let total: number = 0;
      console.log(value);
      let activityName: string | undefined = "";
      let companyName: string | undefined = "";
      _.forEach(timeReports[key], timeReportRow => {
        activityName = timeReportRow.activityName;
        companyName = timeReportRow.companyName;
        total += _.sumBy(timeReportRow.timeReportRows, (row: TimeReportRow) => +row.hours);
      });
      timeReportOverviewData.push({
        userId: key,
        companyName,
        activityName,
        totalHours: total
      })
    });
    setTimeReportOverviewData(timeReportOverviewData);
    console.log(timeReportOverviewData);
    return timeReportOverviewData;
  };


  const toggleDetailView = async (employeeId?: string): Promise<void> => {
    if (employeeId) {
      await onDateSelect(selectedDate, true);
      setShowDetailView(true);
    } else {
      await onDateSelect(selectedDate);
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
        <TimeCardContainer
            isDetailView={showDetailView}
            toggleDetailView={toggleDetailView}
            timeReportOverviewData={timeReportOverviewData}
        />
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
  cursor: pointer;
  span {
    width: inherit;
    text-align: left;
    padding: 0 10px 0 5px;
  }
`;