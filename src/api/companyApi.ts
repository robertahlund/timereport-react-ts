import firebase from '../firebaseConfig';
import {Company} from "../components/companies/CompanyList";
import {ActivitySelectOptions} from "../components/companies/CompanyModal";
import {CompanySelectOptions} from "../components/employees/EmployeeModal";

export const getCompanies = async (): Promise<Company[] | string> => {
  const db = firebase.firestore();
  try {
    let companyList: Company[] = [];
    await db
      .collection("companies")
      .get()
      .then((userDocuments: any) => {
        userDocuments.forEach((company: any) => {
          companyList.push(company.data());
        })
      });
    return new Promise<Company[]>(resolve => resolve(companyList))
  } catch (error) {
    return new Promise<Company[] | string>(reject => reject("Error"))
  }
};

export interface ActivityCompanySelectOption {
  value: string;
  label: string;
  companyId: string;
  companyName: string;
}

export const getCompanyActivitiesByCompanies = async (companies: CompanySelectOptions[]): Promise<ActivityCompanySelectOption[] | string> => {
  const db = firebase.firestore();
  const activities: ActivityCompanySelectOption[] = [];
  for (const company of companies) {
    await db
      .collection("companies")
      .doc(company.value)
      .get()
      .then(doc => {
        if (doc.exists) {
          doc.data()!.activities.forEach((activity: ActivityCompanySelectOption) => {
            activities.push({
              label: `${company.label} - ${activity.label}`,
              value: activity.value,
              companyId: company.value,
              companyName: company.label
            })
          })
        }
      })
  }
  if (activities.length > 0) {
    return new Promise<ActivityCompanySelectOption[] | string>(resolve => resolve(activities))
  } else {
    return new Promise<ActivityCompanySelectOption[] | string>(reject => reject("Activity list is empty"))
  }
};

export const getCompaniesByActivityId = async (activityId: string): Promise<Company[] | string> => {
  const companies = await getCompanies();
  if (typeof companies === "string") {
    return new Promise(reject => reject("Error"))
  } else {
    return companies.filter((company: Company) => company.activities!.some(activity => activity.value === activityId));
  }
};

export const updateCompanies = async (companies: Company[]): Promise<void> => {
  const db = firebase.firestore();
  const batch = db.batch();
  try {
    companies.forEach(company => {
      const companyRef = db.collection("companies").doc(company.id);
      batch.update(companyRef, company);
    });
    await batch.commit();
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (company: Company): Promise<void> => {
  const db = firebase.firestore();
  try {
    await db
      .collection("companies")
      .doc(company.id)
      .update(company);
  } catch (error) {
    console.log(error);
  }
};

export const createCompany = async (company: Company): Promise<string> => {
  const db = firebase.firestore();
  try {
    const companyId = await db
      .collection("companies")
      .add(company)
      .then(async document => {
        await db
          .collection("companies")
          .doc(document.id)
          .update({
            ...company,
            id: document.id
          });
        return document.id;
      });
    return new Promise<string>(resolve => resolve(companyId))
  } catch (error) {
    console.log(error);
    return new Promise<string>(reject => reject("Error"));
  }
};

export const deleteCompany = async (companyId: string): Promise<void> => {
  try {
    const db = firebase.firestore();
    await db
      .collection("companies")
      .doc(companyId)
      .delete();
  } catch (error) {
    console.log(error)
  }
};

