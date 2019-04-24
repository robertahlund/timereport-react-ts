import React, {Fragment, FunctionComponent, useEffect, useState} from 'react';
import styled from "styled-components";
import LoadingIcon from "../../Icons/LoadingIcon";
import firebase from "../../firebaseConfig";
import {UserRoles} from "../../App";

const EmployeeListHeader = styled.div`
  background-color: #fec861;
  display: flex;
  width: calc(100% - 40px);
  justify-content: space-between;
  font-weight: 300;
  padding: 20px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  span {
    cursor: pointer;
    width: 30%;
  }
  span:first-child {
    width: 40%;
  }
  span:last-child {
    text-align: right;
  }
`;

const EmployeeListRow = styled(EmployeeListHeader)`
  border-radius: 0px;
  background: #fff;
  cursor: pointer;
  border-bottom: 1px solid #f1f1f1;
  transition: all .07s;
  position: relative;
  &:hover {
    transform: scale(1.01);
    //zoom: 1.15;
  }
`;

interface EmployeeRow {
  name: string;
  uid: string;
  email: string;
  roles: UserRoles[]
}

interface EmployeeListProps {
  selectUser: (uid: string) => void;
}

const EmployeeList: FunctionComponent<EmployeeListProps> = props => {
  const initialEmployeeState: EmployeeRow[] = [];
  const [employeeList, setEmployeeList] = useState(initialEmployeeState);
  const [loading, setLoading] = useState(false);

  const getEmployees = async (): Promise<void> => {
    setLoading(true);
    try {
      const db = firebase.firestore();
      const employeeData : EmployeeRow[] = [];
      await db.collection('users').get()
        .then(documents => {
          documents.forEach(doc => {
            let employee: EmployeeRow = {
              name: `${doc.data().firstName} ${doc.data().lastName}`,
              uid: doc.data().uid,
              email: doc.data().email,
              roles: doc.data().roles.join(', ')
            };
            employeeData.push(employee);
          })
        });
      setEmployeeList(employeeData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const sortData = (column: string, order: 'asc' | 'desc'): void => {
    //TODO implement sort
  };

  return (
    <Fragment>
      <EmployeeListHeader>
        <span>Name</span>
        <span>Email</span>
        <span>Roles</span>
      </EmployeeListHeader>
      {employeeList.length > 0 && !loading ?
        employeeList.map(employee => {
          return (
            <EmployeeListRow key={employee.uid} onClick={() => props.selectUser(employee.uid)}>
              <span>{employee.name}</span>
              <span>{employee.email}</span>
              <span>{employee.roles}</span>
            </EmployeeListRow>
          )
        }) : (
          loading ? (
            <EmployeeListRow>
              <LoadingIcon position="relative" left="0" height="30px" width="30px" color="#393e41"/>
            </EmployeeListRow>
          ) : (
            <EmployeeListRow>
              <span>No employees.</span>
            </EmployeeListRow>
          )

        )
      }
    </Fragment>);
};

export default EmployeeList;