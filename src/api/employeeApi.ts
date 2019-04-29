import firebase from '../firebaseConfig';
import {AuthObject} from "../App";

export const getEmployees = async (): Promise<AuthObject[] | string> => {
  const db = firebase.firestore();
  try {
    let employeeList: AuthObject[] = [];
    await db
      .collection("users")
      .get()
      .then((userDocuments: any) => {
        userDocuments.forEach((user: any) => {
          employeeList.push(user.data());
        })
      });
    return new Promise<AuthObject[]>(resolve => resolve(employeeList))
  } catch (error) {
    return new Promise<AuthObject[] | string>(reject => reject("Error"))
  }
};

export const getEmployeesByCompanyId = async (companyId: string): Promise<AuthObject[] | string> => {
  const employees = await getEmployees();
  if (typeof employees === "string") {
    return new Promise(reject => reject("Error"))
  } else {
    return employees.filter((user: AuthObject) => user.companies!.some(company => company.value === companyId));
  }
};

export const updateEmployees = async (employees: AuthObject[]): Promise<void> => {
  const db = firebase.firestore();
  const batch = db.batch();
  try {
    employees.forEach(employee => {
      const employeeRef = db.collection("users").doc(employee.uid);
      batch.update(employeeRef, employee);
    });
    await batch.commit();
  } catch (error) {
    console.log(error);
  }
};

export const updateEmployee = async (employee: AuthObject): Promise<void> => {
  const db = firebase.firestore();
  try {
    await db
      .collection("users")
      .doc(employee.uid)
      .update(employee);
  } catch (error) {
    console.log(error);
  }
};

