import firebase from "../config/firebaseConfig";
import { getCompanyActivitiesByCompanies } from "./companyApi";
import { User } from "firebase";
import {
  ActivityCompanySelectOption,
  AuthObject,
  CompanySelectOptions,
  EmployeeRow
} from "../types/types";
import _ from "lodash";

export const createEmployee = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  checkbox: boolean
): Promise<string> => {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  const user: User | null = await firebase.auth().currentUser;
  if (user) {
    await user.updateProfile({
      displayName: `${firstName} ${lastName}`
    });
    const uid = user.uid;
    const userDocument: AuthObject = {
      firstName,
      lastName,
      uid,
      email,
      inactive: false,
      roles: checkbox ? ["Administrator", "Employee"] : ["Employee"],
      companies: []
    };
    const db = firebase.firestore();
    await db
      .collection("users")
      .doc(uid)
      .set(userDocument);
    console.log(userDocument, "account created");
    return Promise.resolve("Account created.");
  } else return Promise.reject("Error");
};

export const getEmployeeById = async (uid: string): Promise<AuthObject> => {
  const db = firebase.firestore();
  try {
    const usersCollection = db.collection("users");
    let userData: AuthObject = {};
    await usersCollection
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          userData = doc.data() as AuthObject;
          userData.isAdmin = userData.roles
            ? userData.roles.includes("Administrator")
            : false;
        }
      });
    if (usersCollection) {
      return Promise.resolve(userData);
    } else return Promise.reject("No user with that id exists");
  } catch (error) {
    return Promise.reject("Error retrieving employee");
  }
};

export const getEmployeesForList = async (): Promise<EmployeeRow[]> => {
  const db = firebase.firestore();
  try {
    let employeeList: EmployeeRow[] = [];
    await db
      .collection("users")
      .get()
      .then(userDocuments => {
        userDocuments.forEach(user => {
          employeeList.push({
            name: `${user.data().firstName} ${user.data().lastName}`,
            uid: user.data().uid,
            email: user.data().email,
            roles: user.data().roles.join(", "),
            companies: user.data().companies
          });
        });
      });
    return Promise.resolve(employeeList);
  } catch (error) {
    return Promise.reject("Error retrieving employees");
  }
};

export const getEmployees = async (): Promise<AuthObject[]> => {
  const db = firebase.firestore();
  try {
    const employeeList: AuthObject[] = [];
    await db
      .collection("users")
      .get()
      .then(userDocuments => {
        userDocuments.forEach(user => {
          employeeList.push(user.data() as AuthObject);
        });
      });
    return Promise.resolve(employeeList);
  } catch (error) {
    return Promise.reject("Error retrieving employees");
  }
};

export const getEmployeesByCompanyId = async (
  companyId: string
): Promise<AuthObject[]> => {
  try {
    const employees: AuthObject[]  = await getEmployees();
    return Promise.resolve(
      employees.filter((user: AuthObject) => {
        if (user.companies) {
          user.companies.some(company => company.value === companyId);
        }
      })
    );
  } catch (error) {
    console.log(error);
    return Promise.reject("Error retrieving employee");
  }
};

export const updateEmployees = async (
  employees: AuthObject[]
): Promise<void> => {
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

export const getAllActivitiesAssignedToUser = async (
  uid: string
): Promise<ActivityCompanySelectOption[]> => {
  const db = firebase.firestore();
  try {
    const userCompanies: CompanySelectOptions[] | null = await db
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data()!.companies as CompanySelectOptions[];
        } else return null;
      });
      if (userCompanies && userCompanies.length > 0) {
        const userActivities: ActivityCompanySelectOption[] = await getCompanyActivitiesByCompanies(
          userCompanies
        );
        return Promise.resolve(userActivities);
      } else return Promise.resolve([]);
  } catch (error) {
    return Promise.reject("Error retrieving activities");
  }
};

export const checkIfUserIsInactive = async (
  user: User
): Promise<boolean> => {
  try {
    const db = firebase.firestore();
    const usersCollection = db.collection("users");
    const inactive: boolean = await usersCollection
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data()!.inactive;
        } else return false;
      });
    return Promise.resolve(inactive);
  } catch (error) {
    return Promise.reject("Error retrieving user status");
  }
};

export const checkIfUserInformationHasChanged = async (
  user: User
): Promise<boolean> => {
  try {
    const db = firebase.firestore();
    const usersCollection = db.collection("users");
    let userData: AuthObject = {};
    const updateNeeded = await usersCollection
      .doc(user.uid)
      .get()
      .then(async doc => {
        if (doc.exists) {
          userData = doc.data() as AuthObject;
          const [firstName, lastName] = user.displayName!.split(" ");
          if (
            firstName !== userData.firstName ||
            lastName !== userData.lastName ||
            user.email !== userData.email!.toLowerCase()
          ) {
            await user.updateProfile({
              displayName: `${userData.firstName} ${userData.lastName}`
            });
            await user.updateEmail(userData.email!);
            return Promise.resolve(true);
          } else return Promise.resolve(false);
        } else return false;
      });
    return Promise.resolve(updateNeeded);
  } catch (error) {
    return Promise.reject("Error retrieving user update status");
  }
};
