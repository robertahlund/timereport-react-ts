import firebase from '../firebaseConfig';
import {TimeReport} from "../components/timereport/Time";

const db = firebase.firestore();

export const createOrUpdateTimeReportRows = async (timeReports: TimeReport[]): Promise<TimeReport[] | string> => {
  try {
    const allTimeReports: TimeReport[] = [];
    for (const timeReport of timeReports) {
      if (!timeReport.id) {
        const createdTimeReport = await createTimeReports(timeReport);
        if (typeof createdTimeReport === "string") {
          return new Promise<TimeReport[] | string>(reject => reject("Error"))
        } else {
          allTimeReports.push(createdTimeReport);
        }
      } else {
        const updatedTimeReport = await updateTimeReports(timeReport);
        if (typeof updatedTimeReport === "string") {
          return new Promise<TimeReport[] | string>(reject => reject("Error"))
        } else {
          allTimeReports.push(updatedTimeReport);
        }
      }
    }
    return new Promise<TimeReport[] | string>(resolve => resolve(allTimeReports))
  } catch (error) {
    return new Promise<TimeReport[] | string>(reject => reject("Error"))
  }
};

export const createTimeReports = async (timeReport: TimeReport): Promise<TimeReport | string> => {
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
    return new Promise<TimeReport | string>(resolve => resolve(timeReport))
  } catch (error) {
    return new Promise<TimeReport | string>(reject => reject("Error"))
  }
};

export const updateTimeReports = async (timeReport: TimeReport): Promise<TimeReport | string> => {
  try {
    timeReport = await db
      .collection("timeReports")
      .doc(timeReport.id)
      .update(timeReport)
      .then(() => {
        return timeReport
      });
    return new Promise<TimeReport | string>(resolve => resolve(timeReport))
  } catch (error) {
    return new Promise<TimeReport | string>(reject => reject("Error"))
  }
};

export const deleteTimeReport = async (timeReportId: string): Promise<string> => {
  try {
    await db
      .collection("timeReports")
      .doc(timeReportId)
      .delete();
    return new Promise<string>(resolve => resolve("Successfully deleted."))
  } catch (error) {
    return new Promise<string>(reject => reject("Error"))
  }
};

export const getTimeReportsByDate = async (startDate: string, userId: string): Promise<TimeReport[] | string> => {
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
            companyId: doc.data().activityId,
            companyName: doc.data().companyName,
            date: doc.data().date,
            prettyDate: doc.data().prettyDate,
            timeReportRows: doc.data().timeReportRows
          })
        })
      });
    return new Promise<TimeReport[]|string>(resolve => resolve(timeReports))
  } catch (error) {
    return new Promise<TimeReport[]|string>(reject => reject("Error"))
  }
};