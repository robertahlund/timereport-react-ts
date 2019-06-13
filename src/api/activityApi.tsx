import firebase from '../config/firebaseConfig';
import {Activity} from "../types/types";

export const getActivities = async (): Promise<Activity[]> => {
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
    return Promise.resolve(activityList)
  } catch (error) {
    return Promise.reject("Error retrieving activities")
  }
};

export const getActivityById = async (activityId: string): Promise<Activity> => {
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
      return Promise.resolve(activityData);
    } else return Promise.reject("No activity with that id")
  } catch (error) {
    return Promise.reject("Error retrieving data")
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
    return Promise.resolve(activityId);
  } catch (error) {
    console.log(error);
    return Promise.reject("An error occured when creating the activity");
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
