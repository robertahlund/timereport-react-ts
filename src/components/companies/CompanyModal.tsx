import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import CloseIcon from "../../Icons/CloseIcon";
import Button from "../general/Button";
import {ModalBackground, ModalContent, ModalHeader, ModalTitle, Section} from "../account/MyAccountModal";
import firebase from "../../config/firebaseConfig";
import LoadingIcon from "../../Icons/LoadingIcon";
import CompanyForm from "./CompanyForm";
import CompanyModalActivityList from "./CompanyModalActivityList";
import {ValueType} from "react-select/lib/types";
import {toast} from "react-toastify";
import {ButtonRow} from "../activities/ActivityModal";
import {getEmployeesByCompanyId, updateEmployees} from "../../api/employeeApi";
import {createCompany, deleteCompany, updateCompany} from "../../api/companyApi";
import {ActivitySelectOptions, AuthObject, Company} from "../../types/types";
import {updateTimeReportByCompanyId} from "../../api/timeReportApi";
import {stringCompare} from "../../utilities/stringCompare";

interface CompanyModalProps {
  toggleModal: (event?: React.MouseEvent) => void;
  companyId: string;
  getAllCompanies: () => Promise<void>;
}

const CompanyModal: FunctionComponent<CompanyModalProps> = props => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const initialActivityListState: ActivitySelectOptions[] = [];
  const [activityList, setActivityList] = useState(initialActivityListState);
  const initialCompanyActivityList: ActivitySelectOptions[] = [];
  const [companyActivityList, setCompanyActivityList] = useState(initialCompanyActivityList);
  const [originalCompanyActivityList, setOriginalCompanyActivityList] = useState(initialCompanyActivityList);
  const initialCompanyState: Company = {
    id: "",
    orgNumber: "",
    name: ""
  };
  const [company, setCompany] = useState(initialCompanyState);
  const [originalCompany, setOriginalCompany] = useState(initialCompanyState);
  const [isNew, setIsNew] = useState(props.companyId === "");

  useEffect(() => {
    if (!isNew) {
      // noinspection JSIgnoredPromiseFromCall
      removeAddedActivitiesFromList();
    } else {
      // noinspection JSIgnoredPromiseFromCall
      getActivities()
    }
  }, []);

  const getCompanyById = async (): Promise<ActivitySelectOptions[] | string> => {
    const {companyId} = props;
    try {
      const db = firebase.firestore();
      const companyActivities = await db.collection("companies")
        .doc(companyId)
        .get()
        .then(doc => {
          if (doc.exists) {
            // @ts-ignore
            const companyData: Company = doc.data();
            setModalLoading(false);
            setCompany(companyData);
            setOriginalCompany(companyData);
            setCompanyActivityList(doc.data()!.activities);
            setOriginalCompanyActivityList(doc.data()!.activities);
            return doc.data()!.activities;
          }
          console.log(doc.data());
          return new Promise<string>(reject => reject("Error, document does not exist."))
        });
      return new Promise<ActivitySelectOptions[] | string>(resolve => resolve(companyActivities))
    } catch (error) {
      console.log(error);
      return new Promise<string>(reject => reject("Error, something went wrong."))
    }

  };

  const getActivities = async (): Promise<ActivitySelectOptions[] | string> => {
    try {
      const db = firebase.firestore();
      const activityData: ActivitySelectOptions[] = [];
      await db.collection('activities').orderBy("name", "asc").get()
        .then(documents => {
          documents.forEach(doc => {
            const activity: ActivitySelectOptions = {
              value: doc.id,
              label: doc.data().name
            };
            activityData.push(activity);
          })
        });
      setActivityList(activityData);
      return new Promise<ActivitySelectOptions[] | string>(resolve => resolve(activityData));
    } catch (error) {
      console.log(error);
      return new Promise<ActivitySelectOptions[] | string>(reject => reject("Error"))
    }
  };

  const removeAddedActivitiesFromList = async (): Promise<void> => {
    let allActivities = await getActivities();
    const assignedActivities: ActivitySelectOptions[] | string | undefined = await getCompanyById();
    if (typeof assignedActivities !== "string") {
      assignedActivities.forEach(assignedActivity => {
        if (typeof allActivities !== "string") {
          allActivities = [...allActivities.filter(activity => activity.value !== assignedActivity.value)];
          setActivityList(allActivities);
        }
      })
    }
  };

  const onFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCompany({
      ...company,
      [event.target.name]: event.target.value
    })
  };

  const handleSelectChange = (value: ValueType<any>): void => {
    console.log(value);
    setCompanyActivityList([
      ...companyActivityList,
      {
        value: value.value,
        label: value.label
      }
    ]);
    removeActivityFromComboboxList(value.value);
  };

  const handleRemoveFromCompanyActivityList = (activity: ValueType<any>): void => {
    removeActivityFromCompanyActivityList(activity.value);
    addActivityToComboboxList(activity);
  };

  const removeActivityFromCompanyActivityList = (id: string): void => {
    setCompanyActivityList([...companyActivityList.filter(activity => activity.value !== id)])
  };

  const removeActivityFromComboboxList = (id: string): void => {
    setActivityList([...activityList.filter(activity => activity.value !== id)])
  };

  const addActivityToComboboxList = (activity: ValueType<any>): void => {
    setActivityList([...activityList, {value: activity.value, label: activity.label}]);
  };

  const createNewCompany = async (): Promise<void> => {
    try {
      const companyData: Company = {
        id: "",
        name: company.name,
        orgNumber: company.orgNumber,
        activities: [...companyActivityList]
      };
      const companyId = await createCompany(companyData);
      toast.success(`Successfully created ${company.name}!`);
      setCompany({...companyData, id: companyId});
      setOriginalCompany({...companyData, id: companyId});
      setIsNew(false);
      setModalLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCompanyNameOnEmployees = (employeeList: AuthObject[], companyId: string, newCompanyName: string): AuthObject[] => {
    employeeList.forEach(employee => {
      employee.companies!.forEach(company => company.value === companyId ? company.label = newCompanyName : null)
    });
    return employeeList;
  };

  const onUpdateCompany = async (): Promise<void> => {
    try {
      const employees = await getEmployeesByCompanyId(company.id);
      if (typeof employees !== "string") {
        const updatedEmployeeList = updateCompanyNameOnEmployees(employees, company.id, company.name);
        await updateEmployees(updatedEmployeeList);
        await updateCompany({...company, activities: [...companyActivityList]});
        if (stringCompare(company.name, originalCompany.name)) {
          await updateTimeReportByCompanyId(company.id, company.name);
        }
        setOriginalCompany({...company, activities: [...companyActivityList]});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isNew) {
        await createNewCompany();
        setLoading(false);
      } else {
        await onUpdateCompany();
        setLoading(false);
      }
      // noinspection JSIgnoredPromiseFromCall
      props.getAllCompanies()
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const removeCompanyFromEmployeeList = (employeeList: AuthObject[], companyId: string): AuthObject[] => {
    let updatedEmployeeList: AuthObject[] = [];
    employeeList.forEach(employee => {
      employee.companies = employee.companies!.filter(company => company.value !== companyId);
      updatedEmployeeList.push(employee);
    });
    return updatedEmployeeList;
  };

  const onDeleteCompany = async (): Promise<void> => {
    setDeleteLoading(true);
    try {
      const employees = await getEmployeesByCompanyId(company.id);
      if (typeof employees !== "string") {
        const updatedEmployeeList = removeCompanyFromEmployeeList(employees, company.id);
        await updateEmployees(updatedEmployeeList);
        await deleteCompany(company.id);
        toast.success(`Successfully deleted ${company.name}`);
        props.toggleModal();
      }
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
    }
  };

  return (
    <ModalBackground onClick={props.toggleModal}>
      {modalLoading && !isNew ? (
        <LoadingIcon position="relative" left="0px" height="100px" width="100px" color="#393e41"/>
      ) : (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {isNew ? "Create new company" : originalCompany.name}
            </ModalTitle>
            <CloseIcon
              color="#fff"
              background={true}
              backgroundColor="#fec861"
              onClick={props.toggleModal}
              margin="20px 20px 0 0"
              height="24px"
              width="24px"
            />
          </ModalHeader>
          <Section>
            <CompanyForm form={company} onFormChange={onFormChange} selectOptions={activityList}
                         handleSelectChange={handleSelectChange}/>
            <CompanyModalActivityList companySelectOptions={companyActivityList}
                                      handleRemoveFromCompanyActivityList={handleRemoveFromCompanyActivityList}/>
            <ButtonRow isNew={isNew}>
              {!isNew && <Button type="button" text="Delete" onSubmit={onDeleteCompany} buttonType="Delete"
                                 loading={deleteLoading}/>}
              <Button
                type="button"
                text={isNew ? "Create" : "Update"}
                loading={loading}
                onSubmit={onSubmit}
              />
            </ButtonRow>
          </Section>
        </ModalContent>
      )}
    </ModalBackground>
  );
};

export default CompanyModal;