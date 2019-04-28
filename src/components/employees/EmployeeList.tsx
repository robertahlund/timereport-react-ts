import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import LoadingIcon from "../../Icons/LoadingIcon";
import firebase from "../../firebaseConfig";
import { UserRoles } from "../../App";
import Input from "../general/Input";
import { PaddingRow } from "../authentication/LoginForm";
import { EmployeeCompanyList } from "./EmployeeModal";

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

interface EmployeeRow {
  name: string;
  uid: string;
  email: string;
  roles: UserRoles[];
  companies: EmployeeCompanyList;
}

interface EmployeeListProps {
  selectUser: (uid: string) => void;
}

interface Sort {
  column: Column;
  order: Order;
}

type Column = "name" | "email";
type Order = "asc" | "desc";

const EmployeeList: FunctionComponent<EmployeeListProps> = props => {
  const initialEmployeeState: EmployeeRow[] = [];
  const initialSortState: Sort = {
    column: "name",
    order: "asc"
  };
  const [employeeList, setEmployeeList] = useState(initialEmployeeState);
  const [clonedEmployeeList, setClonedEmployeeList] = useState(
    initialEmployeeState
  );
  const [loading, setLoading] = useState(false);
  const [sortMethod, setSortMethod] = useState(initialSortState);
  const [searchValue, setSearchValue] = useState("");

  const getEmployees = async (): Promise<void> => {
    setLoading(true);
    try {
      const db = firebase.firestore();
      await db
        .collection("users")
        .orderBy("firstName", "asc")
        .orderBy("lastName", "asc")
        .onSnapshot(querySnapshot => {
          const employeeData: EmployeeRow[] = [];
          querySnapshot.forEach(doc => {
            let employee: EmployeeRow = {
              name: `${doc.data().firstName} ${doc.data().lastName}`,
              uid: doc.data().uid,
              email: doc.data().email,
              roles: doc.data().roles.join(", "),
              companies: doc.data().companies
            };
            employeeData.push(employee);
          });
          setEmployeeList(employeeData);
          setClonedEmployeeList(employeeData);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getEmployees();
    return () => {
      const db = firebase.firestore();
      const unsubscribe = db.collection("users").onSnapshot(() => {});
      unsubscribe();
    };
  }, []);

  const sortData = (sortMethod: Sort): void => {
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

  const sortAsc = (column: Column): void => {
    const listToSort: EmployeeRow[] = JSON.parse(JSON.stringify(employeeList));
    listToSort.sort((a: EmployeeRow, b: EmployeeRow): number => {
      const propA = a[column].toLowerCase();
      const propB = b[column].toLowerCase();
      if (propA < propB) {
        return -1;
      }
      if (propA > propB) {
        return 1;
      }
      return 0;
    });
    setEmployeeList(listToSort);
    setClonedEmployeeList(listToSort);
  };

  const sortDesc = (column: Column): void => {
    const listToSort: EmployeeRow[] = JSON.parse(JSON.stringify(employeeList));
    listToSort.sort((a: EmployeeRow, b: EmployeeRow): number => {
      const propA = a[column].toLowerCase();
      const propB = b[column].toLowerCase();
      if (propB < propA) {
        return -1;
      }
      if (propB > propA) {
        return 1;
      }
      return 0;
    });
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
      employee =>
        employee.name.toLowerCase().indexOf(target.value.toLowerCase()) > -1 ||
        employee.email.toLowerCase().indexOf(target.value.toLowerCase()) > -1
    );
    console.log(searchList);
    setEmployeeList(searchList);
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
        employeeList.map(employee => {
          return (
            <ListRow
              key={employee.uid}
              onClick={() => props.selectUser(employee.uid)}
            >
              <span>{employee.name}</span>
              <span>{employee.email}</span>
              <span>
                {employee.companies.map((company, index) => {
                  if (index !== employee.companies.length - 1) {
                    return (
                      <Fragment key={company.value}>{company.label}, </Fragment>
                    );
                  } else {
                    return (
                      <Fragment key={company.value}>{company.label}</Fragment>
                    );
                  }
                })}
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
    </Fragment>
  );
};

export default EmployeeList;
