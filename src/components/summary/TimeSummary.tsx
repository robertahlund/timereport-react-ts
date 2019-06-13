import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState,
  Fragment
} from "react";
import { ContentSection } from "../employees/Employees";
import TimeSummarySearch from "./TimeSummarySearch";
import DateSelector from "../timereport/DateSelector";
import { TimeReportListHeader } from "../timereport/TimeReportWrapper";
import { addDays, addMonths, format, subMonths } from "date-fns";
import { getFirstAndLastDateOfMonth } from "../../utilities/date/dateUtilities";
import {
  dateSelectorEndValueFormat,
  dateSelectorStartValueFormat,
  initialDateSelectorValue
} from "../../constants/timeReportConstants";
import {
  DateSelectorValue,
  TimeReport,
  TimeReportRow,
  TimeReportRowSummaryDetail,
  TimeReportSummaryOverview
} from "../../types/types";
import TimeCardContainer from "./TimeCardContainer";
import styled from "styled-components";
import DetailedRowContainer from "./DetailedRowContainer";
import ArrowLeft from "../../icons/ArrowLeft";
import { getTimeReportsByDate } from "../../api/timeReportApi";
import { toast } from "react-toastify";
import { Dictionary } from "lodash";
import _ from "lodash";
import {
  initialDetailedRowData,
  initialSelectedUserId,
  initialTimeReportOverviewData
} from "../../constants/summaryConstants";
import LoadingIcon from "../../icons/LoadingIcon";

interface TimeSummaryListHeaderProps {
  showDetailView: boolean;
}

const TimeSummary: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetailView, setShowDetailView] = useState(false);
  const [timeReportOverviewData, setTimeReportOverviewData] = useState(
    initialTimeReportOverviewData
  );
  const [
    clonedTimeReportOverviewData,
    setClonedTimeReportOverviewData
  ] = useState(initialTimeReportOverviewData);
  const [detailedRowData, setDetailedRowData] = useState(
    initialDetailedRowData
  );
  const [dateSelectorValue, setDateSelectorValue] = useState(
    initialDateSelectorValue
  );
  const [selectedUserId, setSelectedUserId] = useState(initialSelectedUserId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Time Summary";
    onDateSelect(new Date());
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);
    filterResults(event.target.value, clonedTimeReportOverviewData);
  };

  const filterResults = (
    value: string,
    clonedData: TimeReportSummaryOverview[]
  ): TimeReportSummaryOverview[] => {
    const searchResult: TimeReportSummaryOverview[] = _.filter(
      clonedData,
      overviewData => {
        if (overviewData.username) {
          return (
            overviewData.username.toLowerCase().indexOf(value.toLowerCase()) >
            -1
          );
        } else return false;
      }
    );
    setTimeReportOverviewData(searchResult);
    return searchResult;
  };

  const handleWeekChange = async (
    direction: "prev" | "next"
  ): Promise<void> => {
    setLoading(true);
    if (direction === "prev") {
      const newSelectedDate: Date = subMonths(selectedDate, 1);
      const firstDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate)
        .first;
      const lastDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate)
        .last;
      const dateSelectorValue: DateSelectorValue = {
        from: format(firstDayOfMonth, dateSelectorStartValueFormat),
        to: format(lastDayOfMonth, dateSelectorEndValueFormat)
      };
      setSelectedDate(firstDayOfMonth);
      setDateSelectorValue(dateSelectorValue);
      const timeReports: TimeReport[] = await getTimeReportsByDate(
        firstDayOfMonth,
        lastDayOfMonth,
        selectedUserId
      );
      if (showDetailView) {
        const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(
          timeReports,
          report => {
            return `${report.activityId}-${report.companyId}`;
          }
        );
        calculateActivityTotals(formattedTimeReports);
        setLoading(false);
      } else {
        const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(
          timeReports,
          "userId"
        );
        calculateTimeReportTotals(formattedTimeReports);
        setLoading(false);
      }
    } else {
      const newSelectedDate: Date = addMonths(selectedDate, 1);
      const firstDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate)
        .first;
      const lastDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate)
        .last;
      const dateSelectorValue: DateSelectorValue = {
        from: format(firstDayOfMonth, dateSelectorStartValueFormat),
        to: format(lastDayOfMonth, dateSelectorEndValueFormat)
      };
      setSelectedDate(firstDayOfMonth);
      setDateSelectorValue(dateSelectorValue);
      const timeReports: TimeReport[] = await getTimeReportsByDate(
        firstDayOfMonth,
        lastDayOfMonth,
        selectedUserId
      );
      if (showDetailView) {
        const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(
          timeReports,
          report => {
            return `${report.activityId}-${report.companyId}`;
          }
        );
        calculateActivityTotals(formattedTimeReports);
        setLoading(false);
      } else {
        const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(
          timeReports,
          "userId"
        );
        calculateTimeReportTotals(formattedTimeReports);
        setLoading(false);
      }
    }
  };

  const onDateSelect = async (
    date: Date,
    isDetailViewToggled = showDetailView,
    userId?: string
  ): Promise<void> => {
    setLoading(true);
    if (_.isNil(userId)) {
      userId = selectedUserId;
    } else if (userId === "") {
      userId = undefined;
    }
    if (typeof isDetailViewToggled === "object") {
      isDetailViewToggled = showDetailView;
    }
    const newSelectedDate: Date = date;
    const firstDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate)
      .first;
    const lastDayOfMonth: Date = getFirstAndLastDateOfMonth(newSelectedDate)
      .last;
    const dateSelectorValue: DateSelectorValue = {
      from: format(firstDayOfMonth, dateSelectorStartValueFormat),
      to: format(lastDayOfMonth, dateSelectorEndValueFormat)
    };
    setSelectedDate(getFirstAndLastDateOfMonth(newSelectedDate).first);
    setDateSelectorValue(dateSelectorValue);
    const timeReports: TimeReport[] = await getTimeReportsByDate(
      firstDayOfMonth,
      lastDayOfMonth,
      userId
    );
    if (isDetailViewToggled) {
      const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(
        timeReports,
        report => {
          return `${report.activityId}-${report.companyId}`;
        }
      );
      calculateActivityTotals(formattedTimeReports);
      setLoading(false);
    } else {
      const formattedTimeReports: Dictionary<TimeReport[]> = _.groupBy(
        timeReports,
        "userId"
      );
      calculateTimeReportTotals(formattedTimeReports);
      setLoading(false);
    }
  };

  const calculateTimeReportTotals = (
    timeReports: Dictionary<TimeReport[]>
  ): TimeReportSummaryOverview[] => {
    let timeReportOverviewData: TimeReportSummaryOverview[] = [];
    _.forEach(timeReports, (value, key) => {
      let total: number = 0;
      let employeeName: string = "";
      _.forEach(timeReports[key], timeReportRow => {
        employeeName = timeReportRow.username;
        total += _.sumBy(
          timeReportRow.timeReportRows,
          (row: TimeReportRow) => +row.hours
        );
      });
      timeReportOverviewData.push({
        userId: key,
        username: employeeName,
        totalHours: total
      });
    });
    const clonedData: TimeReportSummaryOverview[] = _.cloneDeep(
      timeReportOverviewData
    );
    setClonedTimeReportOverviewData(clonedData);
    if (searchValue !== "") {
      timeReportOverviewData = filterResults(searchValue, clonedData);
    }
    setTimeReportOverviewData(timeReportOverviewData);
    return timeReportOverviewData;
  };

  const calculateActivityTotals = (
    timeReports: Dictionary<TimeReport[]>
  ): TimeReportSummaryOverview[] => {
    const rowDetails: TimeReportRowSummaryDetail[] = [];
    const timeReportOverviewData: TimeReportSummaryOverview[] = [];
    _.forEach(timeReports, (value, key) => {
      let total: number = 0;
      console.log(value);
      let activityName: string | undefined = "";
      let companyName: string | undefined = "";
      _.forEach(timeReports[key], timeReportRow => {
        _.forEach(timeReportRow.timeReportRows, row => {
          rowDetails.push({
            activityName: timeReportRow.activityName || "",
            companyName: timeReportRow.companyName || "",
            formattedDate: row.prettyDate,
            hours: +row.hours
          });
        });
        activityName = timeReportRow.activityName;
        companyName = timeReportRow.companyName;
        total += _.sumBy(
          timeReportRow.timeReportRows,
          (row: TimeReportRow) => +row.hours
        );
      });
      timeReportOverviewData.push({
        userId: key,
        companyName,
        activityName,
        totalHours: total
      });
    });
    setTimeReportOverviewData(timeReportOverviewData);
    setDetailedRowData(rowDetails);
    return timeReportOverviewData;
  };

  const toggleDetailView = async (employeeId?: string): Promise<void> => {
    if (employeeId) {
      await onDateSelect(selectedDate, true, employeeId);
      setShowDetailView(true);
      setSelectedUserId(employeeId);
    } else {
      await onDateSelect(selectedDate, false, "");
      setShowDetailView(false);
      setSelectedUserId(undefined);
    }
  };

  return (
    <TimeSummarySection showDetailView={showDetailView}>
      {!showDetailView && (
        <TimeSummarySearch
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />
      )}
      <TimeSummaryListHeader showDetailView={showDetailView}>
        {showDetailView && (
          <Back onClick={() => toggleDetailView()}>
            <ArrowLeft width="24px" height="24px" />
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
        {loading ? (
          <LoadingIconWrapper>
            <LoadingIcon height="30px" width="30px" color="#393e41" />
          </LoadingIconWrapper>
        ) : (
          <Fragment>
            <TimeCardContainer
              isDetailView={showDetailView}
              toggleDetailView={toggleDetailView}
              timeReportOverviewData={timeReportOverviewData}
            />
            {showDetailView && (
              <DetailedRowContainer rowDetails={detailedRowData} />
            )}
          </Fragment>
        )}
      </Wrapper>
    </TimeSummarySection>
  );
};

export default TimeSummary;

const TimeSummarySection = styled(ContentSection)`
  margin: ${(props: TimeSummaryListHeaderProps) =>
    props.showDetailView ? "175px auto 100px auto" : "100px auto 100px auto"};
`;

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 7.5px;
`;

const TimeSummaryListHeader = styled(TimeReportListHeader)`
  justify-content: ${(props: TimeSummaryListHeaderProps) =>
    props.showDetailView ? "space-between" : "flex-end"};
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

const LoadingIconWrapper = styled.div`
  padding: 8.5px;
`;
