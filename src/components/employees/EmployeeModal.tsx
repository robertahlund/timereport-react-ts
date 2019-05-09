import React, {ChangeEvent, Fragment, FunctionComponent, useEffect, useState} from "react";
import styled from "styled-components";
import CloseIcon from "../../icons/CloseIcon";
import Button from "../general/Button";
import firebase from "../../config/firebaseConfig";
import EmployeeModalForm from "./EmployeeModalForm";
import LoadingIcon from "../../icons/LoadingIcon";
import {ValueType} from "react-select/lib/types";
import EmployeeModalCompanyList from "./EmployeeModalCompanyList";
import {AuthObject, CompanySelectOptions, EmployeeCompanyList} from "../../types/types";
import {getEmployeeById, updateEmployee} from "../../api/employeeApi";
import {stringCompare} from "../../utilities/stringCompare";

interface EmployeeModalProps {
  toggleModal: (event: React.MouseEvent) => void;
  uid: string;
  getAllEmployees: () => Promise<void>;
}

const EmployeeModal: FunctionComponent<EmployeeModalProps> = props => {
  const [userInactive, setUserInactive] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
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
    try {
      const db = firebase.firestore();
      const user = await db.collection('users')
        .doc(props.uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            setSelectedUser(doc.data());
            setForm({
              firstName: doc.data()!.firstName ? doc.data()!.firstName : "",
              lastName: doc.data()!.lastName,
              email: doc.data()!.email
            });
            setEmployeeCompanyList(doc.data()!.companies);
            setOriginalEmployeeCompanyList(doc.data()!.companies);
            setUserInactive(doc.data()!.inactive);
            setModalLoading(false);
            return doc.data();
          } else return new Promise(reject => reject("Error"));
        });
      return new Promise<CompanySelectOptions[] | string>(resolve => resolve(user!.companies))
    } catch (error) {
      console.log(error);
      return new Promise(reject => reject("Error"));
    }
  };

  const getCompanies = async (): Promise<CompanySelectOptions[] | string> => {
    try {
      const db = firebase.firestore();
      const companyData: CompanySelectOptions[] = [];
      await db.collection('companies').get()
        .then(documents => {
          documents.forEach(doc => {
            const company: CompanySelectOptions = {
              value: doc.id,
              label: doc.data().name
            };
            companyData.push(company);
          })
        });
      setCompanyList(companyData);
      return new Promise<CompanySelectOptions[] | string>(resolve => resolve(companyData));
    } catch (error) {
      console.log(error);
      return new Promise<CompanySelectOptions[] | string>(reject => reject("Error"))
    }
  };

  const removeAddedCompaniesFromList = async (): Promise<void> => {
    let allCompanies = await getCompanies();
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
      [event.target.name]: event.target.value
    });
  };

  const hasUserCompaniesChanged = (originalCompaniesList: EmployeeCompanyList, newCompaniesList: EmployeeCompanyList): boolean => {
    const originalCompaniesListString: string = JSON.stringify(originalCompaniesList);
    const newCompaniesListString: string = JSON.stringify(newCompaniesList);
    return originalCompaniesListString !== newCompaniesListString;
  };

  const hasUserEmailChanged = (
    originalMail: string,
    newMail: string
  ): boolean => {
    return !!(
      originalMail !== newMail &&
      newMail != null &&
      originalMail != null
    );
  };

  const hasUserNameChanged = (
    originalName: string,
    newName: string
  ): boolean => {
    return !!(
      originalName !== newName &&
      newName != null &&
      originalName != null
    );
  };

  const onSubmit = async (
    firstName?: string,
    lastName?: string,
    email?: string,
    inactive?: boolean,
    companies?: EmployeeCompanyList
  ): Promise<void> => {
    try {
      setLoading(true);
      const user: AuthObject | string = await getEmployeeById(props.uid);
      if (user && typeof user !== "string" && user.firstName && user.lastName && firstName && lastName) {
        if (stringCompare(user.firstName, firstName) || stringCompare(user.lastName, lastName) ||
          user.inactive !== inactive || hasUserCompaniesChanged(originalEmployeeCompanyList, employeeCompanyList)) {
          await updateEmployee({
            uid: props.uid,
            firstName,
            lastName,
            email,
            inactive,
            companies
          });
          console.log("Updated collection with name, inactive status & companies.");
        }
        if (user.email && email) {
          if (stringCompare(user.email, email)) {
            await updateEmployee({uid: props.uid, email});
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
    console.log(value);
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

  const {firstName, lastName, email} = form;

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
            <EmployeeModalCompanyList companySelectOptions={employeeCompanyList}
                                      handleRemoveFromEmployeeCompanyList={handleRemoveFromEmployeeCompanyList}/>
            <Button
              type="button"
              text="Update"
              loading={loading}
              onSubmit={() => onSubmit(firstName, lastName, email, userInactive, employeeCompanyList)}
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