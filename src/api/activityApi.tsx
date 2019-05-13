import firebase from '../config/firebaseConfig';
import {Activity} from "../types/types";

export const getActivities = async (): Promise<Activity[] | string> => {
  try {
    const db = firebase.firestore();
    const activityList: Activity[] = [];
    await db
      .collection("activities")
      .get()
      .then((doc: any) => {
        doc.forEach((activity: any) => {
          activityList.push(activity.data());
        })
      });
    return new Promise<Activity[]>(resolve => resolve(activityList))
  } catch (error) {
    return new Promise<Activity[] | string>(reject => reject("Error"))
  }
};

export const getActivityById = async (activityId: string): Promise<Activity | string> => {
  try {
    const db = firebase.firestore();
    const activityData: Activity | undefined = await db
        .collection("activities")
        .doc(activityId)
        .get()
        .then(doc => {
          if (doc.exists) {
            return doc.data() as Activity;
          } else return undefined;
        });
    if (activityData) {
      return new Promise<Activity>(resolve => resolve(activityData))
    } else return new Promise<string>(reject => reject("Error retrieving data."))
  } catch (error) {
    return new Promise<string>(reject => reject("Error retrieving data."))
  }
};

export const createActivity = async (activity: Activity): Promise<string> => {
  try {
    const db = firebase.firestore();
    const activityId = await db
      .collection("activities")
      .add(activity)
      .then(async document => {
        await db
          .collection("activities")
          .doc(document.id)
          .update({
            ...activity,
            id: document.id
          });
        return document.id;
      });
    return new Promise<string>(resolve => resolve(activityId))
  } catch (error) {
    console.log(error);
    return new Promise<string>(reject => reject("An error occured when creating the activity."));
  }
};

export const updateActivity = async (activity: Activity): Promise<void> => {
  try {
    const db = firebase.firestore();
    await db
      .collection("activities")
      .doc(activity.id)
      .update(activity);
  } catch (error) {
    console.log(error);
  }
};

export const deleteActivity = async (activityId: string): Promise<void> => {
  try {
    const db = firebase.firestore();
    await db
      .collection("activities")
      .doc(activityId)
      .delete()
  } catch (error) {
    console.log(error)
  }
};
