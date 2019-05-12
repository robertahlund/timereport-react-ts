import firebase from "../config/firebaseConfig";
import {getCompanyActivitiesByCompanies} from "./companyApi";
import {User} from "firebase";
import {
  ActivityCompanySelectOption,
  AuthObject,
  CompanySelectOptions,
  EmployeeRow
} from "../types/types";

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
    return new Promise<string>(resolve => resolve("Account created."))
  } else return new Promise<string>(reject => reject("Error"))
};

export const getEmployeeById = async (
  uid: string
): Promise<AuthObject | string> => {
  const db = firebase.firestore();
  try {
    const usersCollection = db.collection("users");
    let userData: AuthObject = {};
    await usersCollection
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          // @ts-ignore
          userData = doc.data();
          userData.isAdmin = userData.roles
            ? userData.roles.includes("Administrator")
            : false;
        }
      });
    return new Promise<AuthObject>(resolve => resolve(userData));
  } catch (error) {
    return new Promise<string>(reject => reject("Error"));
  }
};

export const getEmployeesForList = async (): Promise<EmployeeRow[] | string> => {
  const db = firebase.firestore();
  try {
    let employeeList: EmployeeRow[] = [];
    await db
      .collection("users")
      .get()
      .then((userDocuments: any) => {
        userDocuments.forEach((user: any) => {
          employeeList.push({
            name: `${user.data().firstName} ${user.data().lastName}`,
            uid: user.data().uid,
            email: user.data().email,
            roles: user.data().roles.join(", "),
            companies: user.data().companies
          });
        });
      });
    return new Promise<EmployeeRow[]>(resolve => resolve(employeeList));
  } catch (error) {
    return new Promise<string>(reject => reject("Error"));
  }
};

export const getEmployees = async (): Promise<AuthObject[] | string> => {
  const db = firebase.firestore();
  try {
    const employeeList: AuthObject[] = [];
    await db
      .collection("users")
      .get()
      .then((userDocuments: any) => {
        userDocuments.forEach((user: any) => {
          employeeList.push(user.data());
        });
      });
    return new Promise<AuthObject[]>(resolve => resolve(employeeList));
  } catch (error) {
    return new Promise<string>(reject => reject("Error"));
  }
};

export const getEmployeesByCompanyId = async (
  companyId: string
): Promise<AuthObject[] | string> => {
  const employees = await getEmployees();
  if (typeof employees === "string") {
    return new Promise(reject => reject("Error"));
  } else {
    return new Promise<AuthObject[]>(resolve =>
      resolve(
        employees.filter((user: AuthObject) =>
          user.companies!.some(company => company.value === companyId)
        )
      )
    );
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
): Promise<ActivityCompanySelectOption[] | string> => {
  const db = firebase.firestore();
  try {
    const userCompanies: CompanySelectOptions[] = await db
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data()!.companies;
        }
      });
    const userActivities:
      | ActivityCompanySelectOption[]
      | string = await getCompanyActivitiesByCompanies(userCompanies);
    if (typeof userActivities === "string") {
      return new Promise<string>(reject => reject("Error"));
    }
    return new Promise<ActivityCompanySelectOption[]>(resolve =>
      resolve(userActivities)
    );
  } catch (error) {
    return new Promise<string>(reject => reject("Error"));
  }
};

export const checkIfUserIsInactive = async (
  user: User
): Promise<boolean | string> => {
  try {
    const db = firebase.firestore();
    const usersCollection = db.collection("users");
    const inactive = await usersCollection
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data()!.inactive;
        } else return false;
      });
    return new Promise<boolean>(resolve => resolve(inactive));
  } catch (error) {
    return new Promise<string>(reject => reject("Error"));
  }
};

export const checkIfUserInformationHasChanged = async (
  user: User
): Promise<boolean | string> => {
  try {
    const db = firebase.firestore();
    const usersCollection = db.collection("users");
    let userData: AuthObject = {};
    const updateNeeded = await usersCollection
      .doc(user.uid)
      .get()
      .then(async doc => {
        if (doc.exists) {
          userData = doc.data()!;
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
            return new Promise<boolean>(resolve => resolve(true));
          } else return new Promise<boolean>(resolve => resolve(false));
        } else return false;
      });
    return new Promise<boolean>(resolve => resolve(updateNeeded));
  } catch (error) {
    return new Promise<string>(reject => reject("Error"));
  }
};
