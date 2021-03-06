import React, {
  ChangeEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import {ContentSection} from "../employees/Employees";
import TimeReportWrapper from "./TimeReportWrapper";
import {addDays, endOfWeek, format, startOfWeek, subDays} from "date-fns";
import produce from "immer";
import {getAllActivitiesAssignedToUser} from "../../api/employeeApi";
import {ValueType} from "react-select/lib/types";
import {
  createOrUpdateTimeReportRows,
  deleteTimeReport,
  getTimeReportsByDateAndUserId
} from "../../api/timeReportApi";
import "../../styles/time-react-select.css";
import "../../styles/close-button-transition.css";
import {validateNumberInput} from "../../utilities/validations/validateNumberInput";
import {
  dateSelectorEndValueFormat,
  dateSelectorStartValueFormat,
  initialActivitySelect,
  initialDateSelectorValue,
  initialTimeReportRows,
  initialTotal,
  timeReportDateFormat,
  timeStampFormat
} from "../../constants/timeReportConstants";
import {AuthContext} from "../../context/authentication/authenticationContext";
import {
  ActivityCompanySelectOption, AuthObject,
  DateSelectorValue,
  GroupedActivityOptions,
  TimeReport,
  TimeReportRow,
  TimeReportSummary
} from "../../types/types";
import _ from "lodash";
import {toast} from "react-toastify";

const Time: FunctionComponent = () => {
  const authContext: AuthObject | boolean = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfWeek(new Date(), {weekStartsOn: 1})
  );
  const [dateSelectorValue, setDateSelectorValue] = useState<DateSelectorValue>(
    initialDateSelectorValue
  );
  const [timeReportRows, setTimeReportRows] = useState<TimeReport[]>(initialTimeReportRows);
  const [activitySelectOptions, setActivitySelectOptions] = useState<GroupedActivityOptions[]>(
    initialActivitySelect
  );
  const [total, setTotal] = useState<TimeReportSummary>(initialTotal);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [timeReportLoading, setTimeReportLoading] = useState<boolean>(false);
  const [rowIsSaved, setRowIsSaved] = useState<boolean>(true);
  const [previousWeekRowLoading, setPreviousWeekRowLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Report Time";
    getFirstAndLastDayOfWeek(selectedDate);
    // noinspection JSIgnoredPromiseFromCall
    getInitialData(selectedDate);
  }, []);

  const getFirstAndLastDayOfWeek = (date: Date) => {
    const dateSelectorValue: DateSelectorValue = {
      from: format(
        startOfWeek(date, {weekStartsOn: 1}),
        dateSelectorStartValueFormat
      ),
      to: format(
        endOfWeek(date, {weekStartsOn: 1}),
        dateSelectorEndValueFormat
      )
    };
    setDateSelectorValue(dateSelectorValue);
  };

  const getInitialData = async (date: Date): Promise<void> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    setTimeReportLoading(true);
    const timeReports = await getTimeReportsByDateAndUserId(
      format(date, timeReportDateFormat),
      authContext.uid
    );
    setTimeReportRows(timeReports);
    const userActivities:
      | ActivityCompanySelectOption[]
      | string = await getAllAssignedActivities();

    removeActivityFromCombobox(
      undefined,
      undefined,
      timeReports,
      userActivities
    );
    calculateTotals(timeReports);
    setTimeReportLoading(false);
  };

  const handleWeekChange = async (
    direction: "prev" | "next"
  ): Promise<void> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    setLastSaved("");
    setTimeReportLoading(true);
    if (direction === "prev") {
      const newSelectedDate: Date = subDays(selectedDate, 7);
      const newWeekStartDate: Date = startOfWeek(newSelectedDate, {
        weekStartsOn: 1
      });
      setSelectedDate(newWeekStartDate);
      getFirstAndLastDayOfWeek(newSelectedDate);
      await getInitialData(newWeekStartDate);
    } else {
      const newSelectedDate: Date = addDays(selectedDate, 7);
      const newWeekStartDate: Date = startOfWeek(newSelectedDate, {
        weekStartsOn: 1
      });
      setSelectedDate(newWeekStartDate);
      getFirstAndLastDayOfWeek(newSelectedDate);
      await getInitialData(newWeekStartDate);
    }
    setTimeReportLoading(false);
  };

  const onTimeReportRowChange = (
    event: ChangeEvent<HTMLInputElement>,
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => {
    if (!validateNumberInput(event.target.value)) {
      return;
    }

    let {value} = event.target;
    //if the value is a decimal we can round it to 2 decimal points
    if (value.indexOf(".") > -1 && value.indexOf(".") !== value.length - 1) {
      value = String(Math.round(Number(event.target.value) * 100) / 100);
    }

    if (timeReportIndex !== undefined && timeReportRowIndex !== undefined) {
      //https://github.com/immerjs/immer
      setTimeReportRows(
        produce(timeReportRows, draft => {
          draft[timeReportIndex].timeReportRows[
            timeReportRowIndex
            ].hours = value;
        })
      );
      calculateTotals(
        produce(timeReportRows, draft => {
          draft[timeReportIndex].timeReportRows[
            timeReportRowIndex
            ].hours = value;
        })
      );
    }
  };

  const getAllAssignedActivities = async (): Promise<ActivityCompanySelectOption[]> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return Promise.reject("Authentication error");
    }
    try {
      const userActivities: ActivityCompanySelectOption[] = await getAllActivitiesAssignedToUser(
        authContext.uid
      );
      createOptionList(userActivities);
      return Promise.resolve(userActivities);
    } catch (error) {
      return Promise.reject("Error retrieving activities");
    }
  };

  const handleSelectChange = (option: ValueType<any>): void => {
    createTimeReportRow(option);
    removeActivityFromCombobox(option.value, option.companyId);
  };

  const createTimeReportRow = (activity: ActivityCompanySelectOption): void => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    const firstDayOfWeekDate: Date = selectedDate;
    const newTimeReportRow: TimeReport = {
      id: "",
      userId: authContext.uid,
      username: `${authContext.firstName} ${authContext.lastName}`,
      activityId: activity.value,
      activityName: activity.label,
      companyId: activity.companyId,
      companyName: activity.companyName,
      date: firstDayOfWeekDate,
      prettyDate: format(firstDayOfWeekDate, timeReportDateFormat),
      timeReportRows: []
    };
    for (let i = 0; i <= 6; i++) {
      const newDate: Date = addDays(firstDayOfWeekDate, i);
      const timeReportCell: TimeReportRow = {
        date: newDate,
        prettyDate: format(newDate, timeReportDateFormat),
        hours: ""
      };
      newTimeReportRow.timeReportRows.push(timeReportCell);
    }
    setTimeReportRows([...timeReportRows, newTimeReportRow]);
  };

  const removeActivityFromCombobox = (
    activityId?: string,
    companyId?: string,
    timeReports?: TimeReport[],
    userActivities?: ActivityCompanySelectOption[]
  ): void => {
    if (userActivities && timeReports && !activityId && !companyId) {
      timeReports.forEach(timeReport => {
        _.remove(userActivities, (activity: ActivityCompanySelectOption) => {
          return (
            activity.value === timeReport.activityId &&
            activity.companyId === timeReport.companyId
          );
        });
      });
      createOptionList(userActivities);
    } else {
      const newActivityList: GroupedActivityOptions[] = _.cloneDeep(
        activitySelectOptions
      );
      _.forEach(newActivityList, (activityListItem: GroupedActivityOptions) => {
        _.remove(
          activityListItem.options,
          (activity: ActivityCompanySelectOption) => {
            return (
              activity.companyId === companyId && activity.value === activityId
            );
          }
        );
      });
      setActivitySelectOptions(newActivityList);
    }
  };

  const addActivityToCombobox = (
    activity: ActivityCompanySelectOption
  ): void => {
    const index: number = _.findIndex(
      activitySelectOptions,
      (activityList: GroupedActivityOptions) => {
        return activityList.companyId === activity.companyId;
      }
    );
    if (activitySelectOptions.length > 0 && index > -1) {
      setActivitySelectOptions(
        produce(activitySelectOptions, draft => {
          draft[index].options.push(activity);
        })
      );
    } else {
      setActivitySelectOptions([
        ...activitySelectOptions,
        {
          label: activity.companyName,
          companyId: activity.companyId,
          options: [activity]
        }
      ]);
    }
  };

  const calculateTotals = (timeReportRows: TimeReport[]): void => {
    let total: TimeReportSummary = _.cloneDeep(initialTotal);
    timeReportRows.forEach(timeReport => {
      timeReport.timeReportRows.forEach((row, index) => {
        total.rowTotals[index].total += Number(row.hours);
        total.total += Number(row.hours);
      });
    });
    setTotal(total);
  };

  const deleteRow = async (timeReport: TimeReport): Promise<void> => {
    try {
      if (timeReport.id !== "") {
        await deleteTimeReport(timeReport.id);
      }
      const newTimeReportRows: TimeReport[] = _.cloneDeep(timeReportRows);
      _.remove(newTimeReportRows, (timeReportItem: TimeReport) => {
        return (
          timeReportItem.companyId === timeReport.companyId &&
          timeReportItem.activityId === timeReport.activityId
        );
      });
      setTimeReportRows(newTimeReportRows);
      calculateTotals(newTimeReportRows);
      if (timeReport.activityName && timeReport.companyName) {
        addActivityToCombobox({
          value: timeReport.activityId,
          label: timeReport.activityName,
          companyId: timeReport.companyId,
          companyName: timeReport.companyName
        });
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const saveRows = async (): Promise<void> => {
    try {
      const savedRows: TimeReport[] = await createOrUpdateTimeReportRows(
        timeReportRows
      );
      setTimeReportRows(savedRows);
      setLastSaved(format(new Date(), timeStampFormat));
    } catch (error) {
      console.log(error);
    }
  };

  const saveSingleRow = async (
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ): Promise<void> => {
    if (timeReportRowIndex !== undefined && timeReportIndex !== undefined) {
      const timeReport: TimeReport = timeReportRows[timeReportIndex];
      try {
        if (checkIfAllCellsOnRowAreZero(timeReport) || !rowIsSaved) {
          return;
        } else {
          setRowIsSaved(false);
          const savedRows: TimeReport[] = await createOrUpdateTimeReportRows([
            timeReport
          ]);
          if (timeReport.id === "") {
            setTimeReportRows(
              produce(timeReportRows, draft => {
                draft[timeReportIndex].id = savedRows[0].id;
              })
            );
          }
          setLastSaved(format(new Date(), timeStampFormat));
          setRowIsSaved(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const checkIfAllCellsOnRowAreZero = (timeReport: TimeReport): boolean => {
    return timeReport.timeReportRows.every(
      timeReportCell => timeReportCell.hours === ""
    );
  };

  const onDateSelect = async (date: Date): Promise<void> => {
    setTimeReportLoading(true);
    const newSelectedDate: Date = date;
    const newWeekStartDate: Date = startOfWeek(newSelectedDate, {
      weekStartsOn: 1
    });
    setSelectedDate(newWeekStartDate);
    getFirstAndLastDayOfWeek(newSelectedDate);
    await getInitialData(newWeekStartDate);
  };

  const createOptionList = (userActivities: ActivityCompanySelectOption[]) => {
    const optionList: GroupedActivityOptions[] = [];
    const groupedList = _.groupBy(userActivities, "companyId");
    _.forEach(
      groupedList,
      (value: ActivityCompanySelectOption[], key: string) => {
        optionList.push({
          label: value[0].companyName,
          companyId: key,
          options: value
        });
      }
    );
    setActivitySelectOptions(optionList);
  };

  const clearAllTimeReportHours = (timeReports: TimeReport[]): TimeReport[] => {
    _.forEach(timeReports, timeReportRow => {
      timeReportRow.id = "";
      timeReportRow.date = selectedDate;
      timeReportRow.prettyDate = format(selectedDate, timeReportDateFormat);
      _.forEach(timeReportRow.timeReportRows, (timeReportCell, index) => {
        timeReportCell.hours = "";
        timeReportCell.locked = false;
        timeReportCell.date = addDays(selectedDate, index);
        timeReportCell.prettyDate = format(
          addDays(selectedDate, index),
          timeReportDateFormat
        );
      });
    });
    return timeReports;
  };

  const getRowsFromPreviousWeek = async (): Promise<void> => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return;
    }
    setPreviousWeekRowLoading(true);
    const previousWeekStartDate = format(
      subDays(selectedDate, 7),
      timeReportDateFormat
    );
    let lastWeekRows: TimeReport[] = await getTimeReportsByDateAndUserId(
      previousWeekStartDate,
      authContext.uid
    );
    lastWeekRows = clearAllTimeReportHours(lastWeekRows);
    setTimeReportRows(lastWeekRows);
    const userActivities: ActivityCompanySelectOption[] = await getAllAssignedActivities();
    removeActivityFromCombobox(
      undefined,
      undefined,
      lastWeekRows,
      userActivities
    );
    setPreviousWeekRowLoading(false);
  };

  return (
    <ContentSection>
      <TimeReportWrapper
        handleWeekChange={handleWeekChange}
        dateSelectorValue={dateSelectorValue}
        selectedDate={selectedDate}
        timeReportRows={timeReportRows}
        onTimeReportRowChange={onTimeReportRowChange}
        selectOptions={activitySelectOptions}
        handleSelectChange={handleSelectChange}
        saveRows={saveRows}
        total={total}
        lastSaved={lastSaved}
        timeReportLoading={timeReportLoading}
        deleteRow={deleteRow}
        saveSingleRow={saveSingleRow}
        onDateSelect={onDateSelect}
        getRowsFromPreviousWeek={getRowsFromPreviousWeek}
        previousWeekRowLoading={previousWeekRowLoading}
      />
    </ContentSection>
  );
};

export default Time;
