import React, {ChangeEvent, Fragment, FunctionComponent, useEffect, useState} from "react";
import styled from "styled-components";
import CloseIcon from "../../icons/CloseIcon";
import Button from "../general/Button";
import EmployeeModalForm from "./EmployeeModalForm";
import LoadingIcon from "../../icons/LoadingIcon";
import {ValueType} from "react-select/lib/types";
import EmployeeModalCompanyList from "./EmployeeModalCompanyList";
import {
  AuthObject, Company,
  CompanySelectOptions,
  EmployeeCompanyList,
  EmployeeFormValue
} from "../../types/types";
import {getEmployeeById, updateEmployee} from "../../api/employeeApi";
import {stringCompare} from "../../utilities/compare/stringCompare";
import {initialEmployeeFormState} from "../../constants/employeeConstants";
import {validateEmployeeForm} from "../../utilities/validations/validateEmployeeForm";
import {getCompanies} from "../../api/companyApi";
import _ from "lodash";

interface EmployeeModalProps {
  toggleModal: (event: React.MouseEvent) => void;
  uid: string;
  getAllEmployees: () => Promise<void>;
}

const EmployeeModal: FunctionComponent<EmployeeModalProps> = props => {
  const [userInactive, setUserInactive] = useState(false);
  const [form, setForm] = useState(initialEmployeeFormState);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState();
  const initialCompanyListState: CompanySelectOptions[] = [];
  const [companyList, setCompanyList] = useState(initialCompanyListState);
  const initialEmployeeCompanyList: EmployeeCompanyList = [];
  const [employeeCompanyList, setEmployeeCompanyList] = useState(initialEmployeeCompanyList);
  const [originalEmployeeCompanyList, setOriginalEmployeeCompanyList] = useState(initialEmployeeCompanyList);

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    removeAddedCompaniesFromList()
  }, []);

  const getUserInformation = async (): Promise<CompanySelectOptions[] | string> => {
    const user: AuthObject | string = await getEmployeeById(props.uid);
    if (typeof user !== "string" && user.uid && user.firstName && user.lastName && user.companies && user.email && user.inactive !== undefined) {
      setSelectedUser(user);
      setForm({
        uid: user.uid,
        valid: true,
        firstName: {
          valid: true,
          validationMessage: "",
          value: user.firstName
        },
        lastName: {
          valid: true,
          validationMessage: "",
          value: user.lastName
        },
        email: {
          valid: true,
          validationMessage: "",
          value: user.email
        }
      });
      setEmployeeCompanyList(user.companies);
      setOriginalEmployeeCompanyList(user.companies);
      setUserInactive(user.inactive);
      setModalLoading(false);
      return new Promise<CompanySelectOptions[]>(resolve => resolve(user.companies))
    } else return new Promise<string>(reject => reject("Error"));
  };

  const _getCompanies = async (): Promise<CompanySelectOptions[] | string> => {
    const allCompanies: Company[] | string = await getCompanies();
    const companyData: CompanySelectOptions[] = [];
    if (typeof allCompanies !== "string") {
      _.forEach(allCompanies, (company: Company) => {
        companyData.push({
          value: company.id,
          label: company.name
        })
      });
      setCompanyList(companyData);
      return new Promise<CompanySelectOptions[]>(resolve => resolve(companyData));
    } else return new Promise<string>(reject => reject("Error"))
  };

  const removeAddedCompaniesFromList = async (): Promise<void> => {
    let allCompanies = await _getCompanies();
    const assignedCompanies: CompanySelectOptions[] | string | undefined = await getUserInformation();
    if (typeof assignedCompanies !== "string") {
      assignedCompanies.forEach(assignedCompany => {
        if (typeof allCompanies !== "string") {
          allCompanies = [...allCompanies.filter(company => company.value !== assignedCompany.value)];
          setCompanyList(allCompanies);
        }
      })
    }
  };

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({
      ...form,
      [event.target.name]: {
        value: event.target.value,
        valid: true,
        validationMessage: ""
      }
    });
  };

  const hasUserCompaniesChanged = (originalCompaniesList: EmployeeCompanyList, newCompaniesList: EmployeeCompanyList): boolean => {
    const originalCompaniesListString: string = JSON.stringify(originalCompaniesList);
    const newCompaniesListString: string = JSON.stringify(newCompaniesList);
    return originalCompaniesListString !== newCompaniesListString;
  };

  const onSubmit = async (): Promise<void> => {
    const validatedForm: EmployeeFormValue = {...validateEmployeeForm(form)};
    if (!validatedForm.valid) {
      console.log(validatedForm);
      setForm(validatedForm);
      return;
    }
    try {
      const {firstName, lastName, email} = form;
      setLoading(true);
      const user: AuthObject | string = await getEmployeeById(props.uid);
      if (user && typeof user !== "string" && user.firstName && user.lastName && firstName && lastName) {
        if (stringCompare(user.firstName, firstName.value) || stringCompare(user.lastName, lastName.value) ||
          user.inactive !== userInactive || hasUserCompaniesChanged(originalEmployeeCompanyList, employeeCompanyList)) {
          await updateEmployee({
            uid: props.uid,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            inactive: userInactive,
            companies: employeeCompanyList
          });
          console.log("Updated collection with name, inactive status & companies.");
        }
        if (user.email && email) {
          if (stringCompare(user.email, email.value)) {
            await updateEmployee({uid: props.uid, email: email.value});
            console.log("Updated email in collection");
          }
        }
        // noinspection JSIgnoredPromiseFromCall
        getUserInformation();
        // noinspection JSIgnoredPromiseFromCall
        props.getAllEmployees();
        setLoading(false);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSelectChange = (value: ValueType<any>): void => {
    setEmployeeCompanyList([
      ...employeeCompanyList,
      {
        label: value.label,
        value: value.value
      }
    ]);
    removeCompanyFromComboboxList(value.value)
  };

  const handleRemoveFromEmployeeCompanyList = (company: ValueType<any>): void => {
    removeCompanyFromEmployeeCompanyList(company.value);
    addCompanyToComboboxList(company);
  };

  const removeCompanyFromEmployeeCompanyList = (id: string): void => {
    setEmployeeCompanyList([...employeeCompanyList.filter(company => company.value !== id)])
  };

  const removeCompanyFromComboboxList = (id: string): void => {
    setCompanyList([...companyList.filter(company => company.value !== id)])
  };

  const addCompanyToComboboxList = (company: ValueType<any>): void => {
    setCompanyList([...companyList, {value: company.value, label: company.label}]);
  };

  return (
    <ModalBackground onClick={props.toggleModal}>
      {modalLoading ? (
        <LoadingIcon position="relative" left="0px" height="100px" width="100px" color="#393e41"/>
      ) : (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {typeof selectedUser === 'object' ? (
                <Fragment>{selectedUser.firstName} {selectedUser.lastName}</Fragment>) : null}
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
            <EmployeeModalForm
              form={form}
              onFormChange={handleFormChange}
              onInactiveChange={(event: ChangeEvent<HTMLInputElement>) => setUserInactive(event.target.checked)}
              inactive={userInactive}
              selectOptions={companyList}
              handleSelectChange={handleSelectChange}
            />
            <EmployeeModalCompanyList
              companySelectOptions={employeeCompanyList}
              handleRemoveFromEmployeeCompanyList={handleRemoveFromEmployeeCompanyList}
            />
            <Button
              type="button"
              text="Update"
              loading={loading}
              onSubmit={onSubmit}
            />
          </Section>
        </ModalContent>
      )}
    </ModalBackground>
  );
};

export default EmployeeModal;

const ModalBackground = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.39);
  z-index: 1;
`;

const ModalContent = styled.div`
  border-radius: 3px;
  background-color: #fff;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  font-weight: 500;
  margin: 0;
  padding: 25px;
`;

const Section = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 3px;
  background: #fff;
  padding: 25px 50px 50px 50px;
  flex-direction: column;
  align-items: center;
  h3 {
    font-weight: 500;
    margin-top: 0;
  }
`;