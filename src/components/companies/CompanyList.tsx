import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import { PaddingRow } from "../authentication/LoginForm";
import Input from "../general/Input";
import LoadingIcon from "../../Icons/LoadingIcon";
import { ListHeader, ListRow } from "../employees/EmployeeList";
import Button from "../general/Button";
import styled from "styled-components";
import firebase from "../../firebaseConfig";
import {ActivitySelectOptions} from "./CompanyModal";

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

type Column = "name" | "orgNumber";
export type Order = "asc" | "desc";

export interface Sort {
  column: Column;
  order: Order;
}

export interface Company {
  id: string;
  name: string;
  orgNumber: string;
  activities?: ActivitySelectOptions[];
}

interface CompanyListProps {
  selectCompany: (companyId: string) => void;
}

const CompanyList: FunctionComponent<CompanyListProps> = props => {
  const [searchValue, setSearchValue] = useState("");
  const initialSortState: Sort = {
    column: "name",
    order: "asc"
  };
  const [sortMethod, setSortMethod] = useState(initialSortState);
  const [loading, setLoading] = useState(false);
  const initialCompanyListState: Company[] = [];
  const [companyList, setCompanyList] = useState(initialCompanyListState);
  const [clonedCompanyList, setClonedCompanyList] = useState(
    initialCompanyListState
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { target } = event;
    setSearchValue(target.value);
    if (target.value === "") {
      setCompanyList(clonedCompanyList);
      return;
    }
    let searchList: Company[];
    searchList = clonedCompanyList.filter(
      company =>
        company.name.toLowerCase().indexOf(target.value.toLowerCase()) > -1 ||
        company.orgNumber.toLowerCase().indexOf(target.value.toLowerCase()) > -1
    );
    setCompanyList(searchList);
  };

  const getCompanies = async (): Promise<void> => {
    setLoading(true);
    try {
      const db = firebase.firestore();
      await db.collection("companies").onSnapshot(querySnapShot => {
        const companyData: Company[] = [];
        querySnapShot.forEach(doc => {
          const company: Company = {
            id: doc.id,
            name: doc.data().name,
            orgNumber: doc.data().orgNumber
          };
          companyData.push(company);
        });
        setCompanyList(companyData);
        setClonedCompanyList(companyData);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getCompanies();
    return () => {
      const db = firebase.firestore();
      const unsubscribe = db.collection("companies").onSnapshot(() => {});
      unsubscribe();
    };
  }, []);

  const sortData = (sortMethod: Sort) => {
    setSortMethod(sortMethod);
    if (sortMethod.column === "name") {
      if (sortMethod.order === "asc") {
        sortAsc(sortMethod.column);
      } else {
        sortDesc(sortMethod.column);
      }
    } else if (sortMethod.column === "orgNumber") {
      if (sortMethod.order === "asc") {
        sortAsc(sortMethod.column);
      } else {
        sortDesc(sortMethod.column);
      }
    }
  };

  const sortAsc = (column: Column): void => {
    const listToSort: Company[] = JSON.parse(JSON.stringify(companyList));
    listToSort.sort((a: Company, b: Company): number => {
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
    setCompanyList(listToSort);
    setClonedCompanyList(listToSort);
  };

  const sortDesc = (column: Column): void => {
    const listToSort: Company[] = JSON.parse(JSON.stringify(companyList));
    listToSort.sort((a: Company, b: Company): number => {
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
    setCompanyList(listToSort);
    setClonedCompanyList(listToSort);
  };

  return (
    <Fragment>
      <PaddingRow>
        <FlexContainer>
          <Input
            labelValue="Search"
            type="text"
            name="search"
            onFormChange={handleSearchChange}
            width="300px"
            value={searchValue}
          />
          <Button
            type="button"
            text="Add company"
            onSubmit={() => props.selectCompany("")}
          />
        </FlexContainer>
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
              column: "name",
              order: sortMethod.order === "asc" ? "desc" : "asc"
            })
          }
        >
          Org. number
        </span>
      </ListHeader>
      {companyList.length > 0 && !loading ? (
        companyList.map((company: Company) => {
          return (
            <ListRow
              key={company.id}
              onClick={() => props.selectCompany(company.id)}
            >
              <span>{company.name}</span>
              <span>{company.orgNumber}</span>
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
          <span>No companies.</span>
        </ListRow>
      )}
    </Fragment>
  );
};

export default CompanyList;
