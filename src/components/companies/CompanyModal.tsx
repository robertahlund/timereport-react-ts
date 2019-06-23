import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import CloseIcon from "../../icons/CloseIcon";
import Button from "../general/Button";
import {
  ModalBackground,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Section
} from "../account/MyAccountModal";
import LoadingIcon from "../../icons/LoadingIcon";
import CompanyForm from "./CompanyForm";
import CompanyModalActivityList from "./CompanyModalActivityList";
import {ValueType} from "react-select/lib/types";
import {toast} from "react-toastify";
import {ButtonRow} from "../activities/ActivityModal";
import {
  getEmployeesByCompanyId,
  updateEmployees
} from "../../api/employeeApi";
import {
  createCompany,
  deleteCompany,
  getCompanyById,
  updateCompany
} from "../../api/companyApi";
import {
  Activity,
  ActivitySelectOptions,
  AuthObject,
  Company,
  CompanyFormValue
} from "../../types/types";
import {updateTimeReportByCompanyId} from "../../api/timeReportApi";
import {stringCompare} from "../../utilities/compare/stringCompare";
import {getActivities} from "../../api/activityApi";
import {initialCompanyState} from "../../constants/companyConstants";
import {validateCompanyForm} from "../../utilities/validations/validateCompanyForm";
import {modalAnimation} from "../../constants/generalConstants";
import {useSpring} from "react-spring";

interface CompanyModalProps {
  toggleModal: (event?: React.MouseEvent) => void;
  companyId: string;
  getAllCompanies: () => Promise<void>;
}

const CompanyModal: FunctionComponent<CompanyModalProps> = props => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(true);
  const initialActivityListState: ActivitySelectOptions[] = [];
  const [activityList, setActivityList] = useState<ActivitySelectOptions[]>(initialActivityListState);
  const initialCompanyActivityList: ActivitySelectOptions[] = [];
  const [companyActivityList, setCompanyActivityList] = useState<ActivitySelectOptions[]>(
    initialCompanyActivityList
  );
  const [company, setCompany] = useState<CompanyFormValue>(initialCompanyState);
  const [originalCompany, setOriginalCompany] = useState<CompanyFormValue>(initialCompanyState);
  const [isNew, setIsNew] = useState<boolean>(props.companyId === "");

  useEffect(() => {
    if (!isNew) {
      // noinspection JSIgnoredPromiseFromCall
      removeAddedActivitiesFromList();
    } else {
      // noinspection JSIgnoredPromiseFromCall
      _getActivities();
    }
  }, []);

  const _getCompanyById = async (): Promise<ActivitySelectOptions[]> => {
    const {companyId} = props;
    const companyData: Company = await getCompanyById(companyId);
    const companyForm: CompanyFormValue = {
      id: companyData.id,
      valid: true,
      name: {
        value: companyData.name,
        valid: true,
        validationMessage: ""
      },
      orgNumber: {
        value: companyData.orgNumber,
        valid: true,
        validationMessage: ""
      }
    };
    setModalLoading(false);
    setCompany(companyForm);
    setOriginalCompany(companyForm);
    if (companyData.activities) {
      setCompanyActivityList(companyData.activities);
      return Promise.resolve(companyData.activities);
    } else return Promise.reject("Missing activity list");
  };

  const _getActivities = async (): Promise<ActivitySelectOptions[]> => {
    try {
      const activityData: ActivitySelectOptions[] = [];
      const activities: Activity[] = await getActivities();
      activities.forEach((activity: Activity) => {
        activityData.push({
          value: activity.id,
          label: activity.name
        });
      });
      setActivityList(activityData);
      return Promise.resolve(activityData);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const removeAddedActivitiesFromList = async (): Promise<void> => {
    let allActivities: ActivitySelectOptions[] = await _getActivities();
    const assignedActivities: ActivitySelectOptions[] = await _getCompanyById();
    assignedActivities.forEach(assignedActivity => {
      allActivities = [
        ...allActivities.filter(
          activity => activity.value !== assignedActivity.value
        )
      ];
      setActivityList(allActivities);
    });
  };

  const onFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCompany({
      ...company,
      [event.target.name]: {
        value: event.target.value,
        valid: true,
        validationMessage: ""
      }
    });
  };

  const handleSelectChange = (value: ValueType<any>): void => {
    setCompanyActivityList([
      ...companyActivityList,
      {
        value: value.value,
        label: value.label
      }
    ]);
    removeActivityFromComboboxList(value.value);
  };

  const handleRemoveFromCompanyActivityList = (
    activity: ValueType<any>
  ): void => {
    removeActivityFromCompanyActivityList(activity.value);
    addActivityToComboboxList(activity);
  };

  const removeActivityFromCompanyActivityList = (id: string): void => {
    setCompanyActivityList([
      ...companyActivityList.filter(activity => activity.value !== id)
    ]);
  };

  const removeActivityFromComboboxList = (id: string): void => {
    setActivityList([
      ...activityList.filter(activity => activity.value !== id)
    ]);
  };

  const addActivityToComboboxList = (activity: ValueType<any>): void => {
    setActivityList([
      ...activityList,
      {value: activity.value, label: activity.label}
    ]);
  };

  const createNewCompany = async (): Promise<void> => {
    try {
      const companyData: Company = {
        id: "",
        name: company.name.value,
        orgNumber: company.orgNumber.value,
        activities: [...companyActivityList]
      };
      const companyId: string = await createCompany(companyData);
      toast.success(`Successfully created ${company.name.value}!`);
      setCompany({...company, id: companyId});
      setOriginalCompany({...company, id: companyId});
      setIsNew(false);
      setModalLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCompanyNameOnEmployees = (
    employeeList: AuthObject[],
    companyId: string,
    newCompanyName: string
  ): AuthObject[] => {
    employeeList.forEach(employee => {
      if (employee.companies) {
        employee.companies.forEach(company =>
          company.value === companyId ? (company.label = newCompanyName) : null
        );
      }
    });
    return employeeList;
  };

  const onUpdateCompany = async (): Promise<void> => {
    try {
      const employees: AuthObject[] = await getEmployeesByCompanyId(company.id);
      const updatedEmployeeList: AuthObject[] = updateCompanyNameOnEmployees(
        employees,
        company.id,
        company.name.value
      );
      await updateEmployees(updatedEmployeeList);
      await updateCompany({
        id: company.id,
        name: company.name.value,
        orgNumber: company.orgNumber.value,
        activities: [...companyActivityList]
      });
      if (stringCompare(company.name.value, originalCompany.name.value)) {
        await updateTimeReportByCompanyId(company.id, company.name.value);
      }
      setOriginalCompany({
        id: company.id,
        valid: true,
        name: {
          value: company.name.value,
          valid: true,
          validationMessage: ""
        },
        orgNumber: {
          value: company.orgNumber.value,
          valid: true,
          validationMessage: ""
        }
      });
      toast.success(`Successfully updated ${company.name.value}!`);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (): Promise<void> => {
    const validatedForm: CompanyFormValue = {...validateCompanyForm(company)};
    if (!validatedForm.valid) {
      console.log(validatedForm);
      setCompany(validatedForm);
      return;
    }
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
      props.getAllCompanies();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const removeCompanyFromEmployeeList = (
    employeeList: AuthObject[],
    companyId: string
  ): AuthObject[] => {
    const updatedEmployeeList: AuthObject[] = [];
    employeeList.forEach(employee => {
      if (employee.companies) {
        employee.companies = employee.companies.filter(
          company => company.value !== companyId
        );
      }
      updatedEmployeeList.push(employee);
    });
    return updatedEmployeeList;
  };

  const onDeleteCompany = async (): Promise<void> => {
    setDeleteLoading(true);
    try {
      const employees: AuthObject[] = await getEmployeesByCompanyId(company.id);
      const updatedEmployeeList: AuthObject[] = removeCompanyFromEmployeeList(
        employees,
        company.id
      );
      await updateEmployees(updatedEmployeeList);
      await deleteCompany(company.id);
      toast.success(`Successfully deleted ${company.name.value}!`);
      props.toggleModal();
      // noinspection JSIgnoredPromiseFromCall
      props.getAllCompanies();
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
    }
  };

  const animation = useSpring(modalAnimation);

  return (
    <ModalBackground onClick={props.toggleModal}>
      {modalLoading && !isNew ? (
        <LoadingIcon
          position="relative"
          left="0px"
          height="100px"
          width="100px"
          color="#393e41"
        />
      ) : (
        <ModalContent style={animation}>
          <ModalHeader>
            <ModalTitle>
              {isNew ? "Create new company" : originalCompany.name.value}
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
            <CompanyForm
              form={company}
              onFormChange={onFormChange}
              selectOptions={activityList}
              handleSelectChange={handleSelectChange}
            />
            <CompanyModalActivityList
              companySelectOptions={companyActivityList}
              handleRemoveFromCompanyActivityList={
                handleRemoveFromCompanyActivityList
              }
            />
            <ButtonRow isNew={isNew}>
              {!isNew && (
                <Button
                  type="button"
                  text="Delete"
                  onSubmit={onDeleteCompany}
                  buttonType="Delete"
                  loading={deleteLoading}
                />
              )}
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
