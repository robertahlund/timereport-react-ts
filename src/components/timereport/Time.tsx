import React, {
  ChangeEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import { ContentSection } from "../employees/Employees";
import TimeReportWrapper from "./TimeReportWrapper";
import { addDays, endOfWeek, format, startOfWeek, subDays } from "date-fns";
import produce from "immer";
import { getAllActivitiesAssignedToUser } from "../../api/employeeApi";
import { ValueType } from "react-select/lib/types";
import {
  createOrUpdateTimeReportRows,
  deleteTimeReport,
  getTimeReportsByDateAndUserId
} from "../../api/timeReportApi";
import "../../styles/time-react-select.css";
import "../../styles/close-button-transition.css";
import { validateNumberInput } from "../../utilities/validations/validateNumberInput";
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
import { AuthContext } from "../../context/authentication/authenticationContext";
import {
  ActivityCompanySelectOption,
  DateSelectorValue,
  GroupedActivityOptions,
  TimeReport,
  TimeReportRow,
  TimeReportSummary
} from "../../types/types";
import _ from "lodash";
import { toast } from "react-toastify";

const Time: FunctionComponent = () => {
  const authContext = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [dateSelectorValue, setDateSelectorValue] = useState(
    initialDateSelectorValue
  );
  const [timeReportRows, setTimeReportRows] = useState(initialTimeReportRows);
  const [activitySelectOptions, setActivitySelectOptions] = useState(
    initialActivitySelect
  );
  const [total, setTotal] = useState(initialTotal);
  const [lastSaved, setLastSaved] = useState("");
  const [timeReportLoading, setTimeReportLoading] = useState(false);
  const [rowIsSaved, setRowIsSaved] = useState(true);
  const [previousWeekRowLoading, setPreviousWeekRowLoading] = useState(false);

  useEffect(() => {
    document.title = "Report Time";
    getFirstAndLastDayOfWeek(selectedDate);
    // noinspection JSIgnoredPromiseFromCall
    getInitialData(selectedDate);
  }, []);

  const getFirstAndLastDayOfWeek = (date: Date) => {
    const dateSelectorValue: DateSelectorValue = {
      from: format(
        startOfWeek(date, { weekStartsOn: 1 }),
        dateSelectorStartValueFormat
      ),
      to: format(
        endOfWeek(date, { weekStartsOn: 1 }),
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
    if (typeof timeReports !== "string") {
      setTimeReportRows(timeReports);
      const userActivities:
        | ActivityCompanySelectOption[]
        | string = await getAllAssignedActivities();
      if (typeof userActivities !== "string") {
        removeActivityFromCombobox(
          undefined,
          undefined,
          timeReports,
          userActivities
        );
      }
      calculateTotals(timeReports);
    }
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

    let { value } = event.target;
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

  const getAllAssignedActivities = async (): Promise<
    ActivityCompanySelectOption[] | string
  > => {
    if (typeof authContext === "boolean" || authContext.uid === undefined) {
      return new Promise<ActivityCompanySelectOption[] | string>(reject =>
        reject("Authentication error.")
      );
    }
    const userActivities:
      | ActivityCompanySelectOption[]
      | string = await getAllActivitiesAssignedToUser(authContext.uid);
    if (typeof userActivities !== "string") {
      createOptionList(userActivities);
      return new Promise<ActivityCompanySelectOption[] | string>(resolve =>
        resolve(userActivities)
      );
    } else
      return new Promise<ActivityCompanySelectOption[] | string>(reject =>
        reject("Error")
      );
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

  const calculateTotals = (timeReportRows: TimeReport[]) => {
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
    let response: string = "";
    if (timeReport.id !== "") {
      response = await deleteTimeReport(timeReport.id);
    }
    if (response !== "Error deleting row.") {
      //TODO set up error constants for all errors
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
      if (response !== "") {
        toast.success(response);
      }
    } else {
      toast.error(response);
    }
  };

  const saveRows = async (): Promise<void> => {
    try {
      const savedRows:
        | TimeReport[]
        | string = await createOrUpdateTimeReportRows(timeReportRows);
      if (typeof savedRows !== "string") {
        setTimeReportRows(savedRows);
        setLastSaved(format(new Date(), timeStampFormat));
      }
      console.log(savedRows);
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
      console.log(timeReport);
      try {
        if (checkIfAllCellsOnRowAreZero(timeReport) || !rowIsSaved) {
          return;
        } else {
          setRowIsSaved(false);
          const savedRows:
            | TimeReport[]
            | string = await createOrUpdateTimeReportRows([timeReport]);
          if (typeof savedRows !== "string") {
            if (timeReport.id === "") {
              setTimeReportRows(
                produce(timeReportRows, draft => {
                  draft[timeReportIndex].id = savedRows[0].id;
                })
              );
            }
            setLastSaved(format(new Date(), timeStampFormat));
            setRowIsSaved(true);
          } else {
            toast.error(savedRows);
          }
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
    let lastWeekRows:
      | TimeReport[]
      | string = await getTimeReportsByDateAndUserId(
      previousWeekStartDate,
      authContext.uid
    );
    if (typeof lastWeekRows !== "string") {
      lastWeekRows = clearAllTimeReportHours(lastWeekRows);
      setTimeReportRows(lastWeekRows);
      const userActivities:
        | ActivityCompanySelectOption[]
        | string = await getAllAssignedActivities();
      if (typeof userActivities !== "string") {
        removeActivityFromCombobox(
          undefined,
          undefined,
          lastWeekRows,
          userActivities
        );
      }
    }
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
