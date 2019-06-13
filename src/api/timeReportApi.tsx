import firebase from "../config/firebaseConfig";
import { TimeReport, TimeReportRow } from "../types/types";
import { addDays, subDays } from "date-fns";
import _, { Dictionary } from "lodash";

const db = firebase.firestore();

export const createOrUpdateTimeReportRows = async (
  timeReports: TimeReport[]
): Promise<TimeReport[]> => {
  try {
    const allTimeReports: TimeReport[] = [];
    for (const timeReport of timeReports) {
      if (!timeReport.id) {
        const createdTimeReport: TimeReport = await createTimeReports(
          timeReport
        );
        allTimeReports.push(createdTimeReport);
      } else {
        const updatedTimeReport: TimeReport = await updateTimeReports(
          timeReport
        );
        allTimeReports.push(updatedTimeReport);
      }
    }
    return Promise.resolve(allTimeReports);
  } catch (error) {
    return Promise.reject("Error creating/updating time report row");
  }
};

export const createTimeReports = async (
  timeReport: TimeReport
): Promise<TimeReport> => {
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
    return Promise.resolve(timeReport);
  } catch (error) {
    return Promise.reject("Error creating time report");
  }
};

export const updateTimeReports = async (
  timeReport: TimeReport
): Promise<TimeReport> => {
  try {
    timeReport = await db
      .collection("timeReports")
      .doc(timeReport.id)
      .update(timeReport)
      .then(() => {
        return timeReport;
      });
    return Promise.resolve(timeReport);
  } catch (error) {
    return Promise.reject("Error updating time report");
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
    return Promise.resolve("Successfully deleted row.");
  } catch (error) {
    return Promise.reject("Error deleting row.");
  }
};

export const getTimeReportsByDateAndUserId = async (
  startDate: string,
  userId: string
): Promise<TimeReport[]> => {
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
            username: doc.data().username,
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
    return Promise.resolve(timeReports);
  } catch (error) {
    return Promise.reject("Error");
  }
};

export const getTimeReportsByDate = async (
  startDate: Date,
  endDate: Date,
  userId: string | undefined
): Promise<TimeReport[]> => {
  const timeReports: TimeReport[] = [];
  try {
    if (_.isNil(userId)) {
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
              username: doc.data().username,
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
    } else {
      await db
        .collection("timeReports")
        .where("date", ">=", subDays(startDate, 7))
        .where("date", "<=", addDays(endDate, 7))
        .where("userId", "==", userId)
        .get()
        .then(documents => {
          documents.forEach(doc => {
            timeReports.push({
              id: doc.data().id,
              userId: doc.data().userId,
              username: doc.data().username,
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
    }
    _.forEach(timeReports, (timeReport: TimeReport) => {
      _.remove(timeReport.timeReportRows, (timeReportRow: TimeReportRow) => {
        return (
          new Date(timeReportRow.prettyDate) < startDate ||
          new Date(timeReportRow.prettyDate) > endDate ||
          timeReportRow.hours === ""
        );
      });
    });
    return Promise.resolve(timeReports);
  } catch (error) {
    console.log(error);
    return Promise.reject("Error retrieving time reports");
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
      .where("expenseId", "==", activityId)
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
