import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import Input from "../general/Input";
import { PaddingRow } from "../authentication/LoginForm";
import {
  initialEmployeeState,
  initialSortState
} from "../../constants/employeeConstants";
import {
  CompanySelectOptions,
  EmployeeColumn,
  EmployeeRow,
  EmployeeSort
} from "../../types/types";
import EmployeeModal from "./EmployeeModal";
import { getEmployeesForList } from "../../api/employeeApi";
import ModalPortal from "../general/ModalPortal";
import LoadingIcon from "../../icons/LoadingIcon";
import _ from "lodash";

const EmployeeList: FunctionComponent = () => {
  const [employeeList, setEmployeeList] = useState<EmployeeRow[]>(initialEmployeeState);
  const [clonedEmployeeList, setClonedEmployeeList] = useState<EmployeeRow[]>(
    initialEmployeeState
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [sortMethod, setSortMethod] = useState<EmployeeSort>(initialSortState);
  const [searchValue, setSearchValue] = useState<string>("");
  const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);
  const [userUid, setUserUid] = useState<string>("");

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getAllEmployees();
  }, []);

  const getAllEmployees = async (): Promise<void> => {
    setLoading(true);
    try {
      const employeeData: EmployeeRow[] = await getEmployeesForList();
      setEmployeeList(employeeData);
      setClonedEmployeeList(employeeData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const sortData = (sortMethod: EmployeeSort): void => {
    setSortMethod(sortMethod);
    if (sortMethod.column === "name") {
      if (sortMethod.order === "asc") {
        sortAsc(sortMethod.column);
      } else {
        sortDesc(sortMethod.column);
      }
    } else if (sortMethod.column === "email") {
      if (sortMethod.order === "asc") {
        sortAsc(sortMethod.column);
      } else {
        sortDesc(sortMethod.column);
      }
    }
  };

  const sortAsc = (column: EmployeeColumn): void => {
    const listToSort: EmployeeRow[] = _.cloneDeep(employeeList);
    listToSort.sort(
      (a: EmployeeRow, b: EmployeeRow): number => {
        const propA = a[column].toLowerCase();
        const propB = b[column].toLowerCase();
        if (propA < propB) {
          return -1;
        }
        if (propA > propB) {
          return 1;
        }
        return 0;
      }
    );
    setEmployeeList(listToSort);
    setClonedEmployeeList(listToSort);
  };

  const sortDesc = (column: EmployeeColumn): void => {
    const listToSort: EmployeeRow[] = _.cloneDeep(employeeList);
    listToSort.sort(
      (a: EmployeeRow, b: EmployeeRow): number => {
        const propA = a[column].toLowerCase();
        const propB = b[column].toLowerCase();
        if (propB < propA) {
          return -1;
        }
        if (propB > propA) {
          return 1;
        }
        return 0;
      }
    );
    setEmployeeList(listToSort);
    setClonedEmployeeList(listToSort);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { target } = event;
    setSearchValue(target.value);
    if (target.value === "") {
      setEmployeeList(clonedEmployeeList);
      return;
    }
    let searchList: EmployeeRow[];
    searchList = clonedEmployeeList.filter(
      (employee: EmployeeRow) =>
        employee.name.toLowerCase().indexOf(target.value.toLowerCase()) > -1 ||
        employee.email.toLowerCase().indexOf(target.value.toLowerCase()) > -1
    );
    console.log(searchList);
    setEmployeeList(searchList);
  };

  const toggleEmployeeModal = (event?: React.MouseEvent): void => {
    if (event) {
      const { target, currentTarget } = event;
      if (target === currentTarget) {
        setShowEmployeeModal(!showEmployeeModal);
      }
    } else setShowEmployeeModal(!showEmployeeModal);
  };

  const selectUser = (uid: string): void => {
    setUserUid(uid);
    toggleEmployeeModal();
  };

  return (
    <Fragment>
      <PaddingRow>
        <Input
          labelValue="Search"
          type="text"
          name="search"
          onFormChange={handleSearchChange}
          width="300px"
          value={searchValue}
        />
      </PaddingRow>
      <ListHeader>
        <span
          onClick={() =>
            sortData({
              column: "name",
              order: sortMethod.order === "asc" ? "desc" : "asc"
            })
          }
        >
          Name
        </span>
        <span
          onClick={() =>
            sortData({
              column: "email",
              order: sortMethod.order === "asc" ? "desc" : "asc"
            })
          }
        >
          Email
        </span>
        <span>Companies</span>
        <span>Roles</span>
      </ListHeader>
      {employeeList.length > 0 && !loading ? (
        employeeList.map((employee: EmployeeRow) => {
          return (
            <ListRow
              key={employee.uid}
              onClick={() => selectUser(employee.uid)}
            >
              <span>{employee.name}</span>
              <span>{employee.email}</span>
              <span>
                {employee.companies.map(
                  (company: CompanySelectOptions, index: number) => {
                    if (index !== employee.companies.length - 1) {
                      return (
                        <Fragment key={company.value}>
                          {company.label},{" "}
                        </Fragment>
                      );
                    } else {
                      return (
                        <Fragment key={company.value}>{company.label}</Fragment>
                      );
                    }
                  }
                )}
              </span>
              <span>{employee.roles}</span>
            </ListRow>
          );
        })
      ) : loading ? (
        <ListRow>
          <LoadingIcon
            position="relative"
            left="0"
            height="30px"
            width="30px"
            color="#393e41"
          />
        </ListRow>
      ) : (
        <ListRow>
          <span>No employees.</span>
        </ListRow>
      )}
      {showEmployeeModal && (
        <ModalPortal>
          <EmployeeModal
            uid={userUid}
            toggleModal={toggleEmployeeModal}
            getAllEmployees={getAllEmployees}
          />
        </ModalPortal>
      )}
    </Fragment>
  );
};

export default EmployeeList;

export const ListHeader = styled.div`
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
    width: 25%;
  }
  span:first-child {
    width: 25%;
  }
  span:last-child:not(:first-child) {
    text-align: right;
  }
`;

export const ListRow = styled(ListHeader)`
  border-radius: 0;
  background: #fff;
  cursor: pointer;
  border-bottom: 1px solid #f1f1f1;
  transition: all 0.07s;
  position: relative;
  &:hover {
    transform: scale(1.01);
    font-size: 16px;
  }
`;
