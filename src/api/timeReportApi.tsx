import firebase from "../config/firebaseConfig";
import {TimeReport, TimeReportRow} from "../types/types";
import {addDays, subDays} from "date-fns";
import _, {Dictionary} from "lodash";

const db = firebase.firestore();

export const createOrUpdateTimeReportRows = async (
  timeReports: TimeReport[]
): Promise<TimeReport[] | string> => {
  try {
    const allTimeReports: TimeReport[] = [];
    for (const timeReport of timeReports) {
      if (!timeReport.id) {
        const createdTimeReport: TimeReport | string = await createTimeReports(
          timeReport
        );
        if (typeof createdTimeReport === "string") {
          return new Promise<TimeReport[] | string>(reject => reject("Error"));
        } else {
          allTimeReports.push(createdTimeReport);
        }
      } else {
        const updatedTimeReport: TimeReport | string = await updateTimeReports(
          timeReport
        );
        if (typeof updatedTimeReport === "string") {
          return new Promise<TimeReport[] | string>(reject => reject("Error"));
        } else {
          allTimeReports.push(updatedTimeReport);
        }
      }
    }
    return new Promise<TimeReport[] | string>(resolve =>
      resolve(allTimeReports)
    );
  } catch (error) {
    return new Promise<TimeReport[] | string>(reject => reject("Error"));
  }
};

export const createTimeReports = async (
  timeReport: TimeReport
): Promise<TimeReport | string> => {
  try {
    timeReport = await db
      .collection("timeReports")
      .add(timeReport)
      .then(async document => {
        await db
          .collection("timeReports")
          .doc(document.id)
          .update({
            ...timeReport,
            id: document.id
          });
        return {
          ...timeReport,
          id: document.id
        };
      });
    return new Promise<TimeReport | string>(resolve => resolve(timeReport));
  } catch (error) {
    return new Promise<TimeReport | string>(reject => reject("Error"));
  }
};

export const updateTimeReports = async (
  timeReport: TimeReport
): Promise<TimeReport | string> => {
  try {
    timeReport = await db
      .collection("timeReports")
      .doc(timeReport.id)
      .update(timeReport)
      .then(() => {
        return timeReport;
      });
    return new Promise<TimeReport | string>(resolve => resolve(timeReport));
  } catch (error) {
    return new Promise<TimeReport | string>(reject => reject("Error"));
  }
};

export const deleteTimeReport = async (
  timeReportId: string
): Promise<string> => {
  try {
    await db
      .collection("timeReports")
      .doc(timeReportId)
      .delete();
    return new Promise<string>(resolve => resolve("Successfully deleted row."));
  } catch (error) {
    return new Promise<string>(reject => reject("Error deleting row."));
  }
};

export const getTimeReportsByDateAndUserId = async (
  startDate: string,
  userId: string
): Promise<TimeReport[] | string> => {
  const timeReports: TimeReport[] = [];
  try {
    await db
      .collection("timeReports")
      .where("userId", "==", userId)
      .where("prettyDate", "==", startDate)
      .get()
      .then(documents => {
        documents.forEach(doc => {
          timeReports.push({
            id: doc.data().id,
            userId: doc.data().userId,
            activityId: doc.data().activityId,
            activityName: doc.data().activityName,
            companyId: doc.data().companyId,
            companyName: doc.data().companyName,
            date: doc.data().date,
            prettyDate: doc.data().prettyDate,
            timeReportRows: doc.data().timeReportRows
          });
        });
      });
    return new Promise<TimeReport[] | string>(resolve => resolve(timeReports));
  } catch (error) {
    return new Promise<TimeReport[] | string>(reject => reject("Error"));
  }
};

export const getTimeReportsByDate = async (
  startDate: Date,
  endDate: Date
): Promise<Dictionary<TimeReport[]> | string> => {
  const timeReports: TimeReport[] = [];
  try {
    await db
      .collection("timeReports")
      .where("date", ">=", subDays(startDate, 7))
      .where("date", "<=", addDays(endDate, 7))
      .get()
      .then(documents => {
        documents.forEach(doc => {
          timeReports.push({
            id: doc.data().id,
            userId: doc.data().userId,
            activityId: doc.data().activityId,
            activityName: doc.data().activityName,
            companyId: doc.data().companyId,
            companyName: doc.data().companyName,
            date: doc.data().date,
            prettyDate: doc.data().prettyDate,
            timeReportRows: doc.data().timeReportRows
          });
        });
      });
    _.forEach(timeReports, (timeReport: TimeReport) => {
      _.remove(timeReport.timeReportRows, (timeReportRow: TimeReportRow) => {
        return new Date(timeReportRow.prettyDate) < startDate || new Date(timeReportRow.prettyDate) > endDate ||
          timeReportRow.hours === ""
      })
    });
    const groupedTimeReports: Dictionary<TimeReport[]> = _.groupBy(timeReports, "userId");
    _.forEach(groupedTimeReports, (value, key) => {
      console.log(key, value)
      console.log("Find a way to get employee name in to the object")
    })
    return new Promise<Dictionary<TimeReport[]>>(resolve => resolve(groupedTimeReports));
  } catch (error) {
    return new Promise<string>(reject => reject("Error"));
  }
};

export const updateTimeReportByActivityId = async (
  activityId: string,
  newActivityName: string
): Promise<void> => {
  try {
    const db = firebase.firestore();
    await db
      .collection("timeReports")
      .where("activityId", "==", activityId)
      .get()
      .then(documents => {
        documents.forEach(async doc => {
          await db
            .collection("timeReports")
            .doc(doc.id)
            .update({
              activityName: newActivityName
            });
        });
      });
  } catch (error) {
    console.log(error);
  }
};

export const updateTimeReportByCompanyId = async (
  companyId: string,
  newCompanyName: string
): Promise<void> => {
  try {
    const db = firebase.firestore();
    await db
      .collection("timeReports")
      .where("companyId", "==", companyId)
      .get()
      .then(documents => {
        documents.forEach(async doc => {
          await db
            .collection("timeReports")
            .doc(doc.id)
            .update({
              companyName: newCompanyName
            });
        });
      });
  } catch (error) {
    console.log(error);
  }
};
