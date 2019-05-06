import firebase from '../config/firebaseConfig';
import {Activity} from "../types/types";

export const getActivities = async (): Promise<Activity[] | string> => {
  const db = firebase.firestore();
  try {
    const activityList: Activity[] = [];
    await db
      .collection("activities")
      .get()
      .then((userDocuments: any) => {
        userDocuments.forEach((activity: any) => {
          activityList.push(activity.data());
        })
      });
    return new Promise<Activity[]>(resolve => resolve(activityList))
  } catch (error) {
    return new Promise<Activity[] | string>(reject => reject("Error"))
  }
};

export const createActivity = async (activity: Activity): Promise<string> => {
  const db = firebase.firestore();
  try {
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
    return new Promise<string>(reject => reject("Error"));
  }
};

export const updateActivity = async (activity: Activity): Promise<void> => {
  const db = firebase.firestore();
  try {
    await db
      .collection("activities")
      .doc(activity.id)
      .update(activity);
  } catch (error) {
    console.log(error);
  }
};

export const deleteActivity = async (activityId: string): Promise<void> => {
  const db = firebase.firestore();
  try {
    await db
      .collection("activities")
      .doc(activityId)
      .delete()
  } catch (error) {
    console.log(error)
  }
};
