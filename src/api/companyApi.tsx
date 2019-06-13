import firebase from "../config/firebaseConfig";
import {
  ActivityCompanySelectOption,
  Company,
  CompanySelectOptions
} from "../types/types";

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const db = firebase.firestore();
    const companyList: Company[] = [];
    await db
      .collection("companies")
      .get()
      .then((userDocuments: any) => {
        userDocuments.forEach((company: any) => {
          companyList.push(company.data());
        });
      });
    return Promise.resolve(companyList);
  } catch (error) {
    return Promise.reject("Error retrieving companies");
  }
};

export const getCompanyById = async (companyId: string): Promise<Company> => {
  try {
    const db = firebase.firestore();
    const companyData: Company | undefined = await db
      .collection("companies")
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log(doc.data());
          return doc.data() as Company;
        } else return undefined;
      });
    if (companyData) {
      return Promise.resolve(companyData);
    } else return Promise.reject("No company with that id exists");
  } catch (error) {
    console.log(error);
    return Promise.reject("Error retrieving company");
  }
};

export const getCompanyActivitiesByCompanies = async (
  companies: CompanySelectOptions[]
): Promise<ActivityCompanySelectOption[]> => {
  const db = firebase.firestore();
  const activities: ActivityCompanySelectOption[] = [];
  for (const company of companies) {
    try {
      await db
        .collection("companies")
        .doc(company.value)
        .get()
        .then(doc => {
          if (doc.exists) {
            doc
              .data()!
              .activities.forEach((activity: ActivityCompanySelectOption) => {
                activities.push({
                  label: activity.label,
                  value: activity.value,
                  companyId: company.value,
                  companyName: company.label
                });
              });
          }
        });
    } catch (error) {
      return Promise.reject("Error retrieving companies");
    }
  }
  if (activities.length > 0) {
    return Promise.resolve(activities);
  } else {
    return Promise.reject("Activity list is empty");
  }
};

export const getCompaniesByActivityId = async (
  activityId: string
): Promise<Company[]> => {
  try {
    const companies = await getCompanies();
      return Promise.resolve(
          companies.filter((company: Company) =>
            company.activities!.some(activity => activity.value === activityId)
          )
        );
  } catch (error) {
    return Promise.reject("Error retrieving companies");
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
    return Promise.resolve(companyId);
  } catch (error) {
    console.log(error);
    return Promise.reject("Error creating company");
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
    console.log(error);
  }
};
