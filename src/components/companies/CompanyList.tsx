import React, {ChangeEvent, Fragment, useEffect, useState} from 'react';
import {PaddingRow} from "../authentication/LoginForm";
import Input from "../general/Input";
import LoadingIcon from "../../Icons/LoadingIcon";
import {ListHeader, ListRow} from "../employees/EmployeeList";
import Button from "../general/Button";
import styled from "styled-components";
import firebase from "../../firebaseConfig";

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface CompanySort {
  column: Column;
  order: Order;
}

type Column = "name" | "orgNumber";
type Order = "asc" | "desc";

interface Company {
  id: string;
  name: string;
  orgNumber: string;
}

const CompanyList = () => {
  const [searchValue, setSearchValue] = useState("");
  const initialSortState: CompanySort = {
    column: "name",
    order: 'asc'
  };
  const [sortMethod, setSortMethod] = useState(initialSortState);
  const [loading, setLoading] = useState(false);
  const initialCompanyListState: Company[] = [];
  const [companyList, setCompanyList] = useState(initialCompanyListState);
  const [clonedCompanyList, setClonedCompanyList] = useState(initialCompanyListState);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const {target} = event;
    setSearchValue(target.value);
    if (target.value === "") {
      setCompanyList(clonedCompanyList);
      return;
    }
    let searchList: Company[];
    searchList = clonedCompanyList.filter(company => company.name.toLowerCase().indexOf(target.value.toLowerCase()) > -1 ||
      company.orgNumber.toLowerCase().indexOf(target.value.toLowerCase()) > -1);
    setCompanyList(searchList);
  };

  const getCompanies = async (): Promise<void> => {
    setLoading(true);
    try {
      const db = firebase.firestore();
      const companyData: Company[] = [];
      await db.collection('companies').get()
        .then(documents => {
          documents.forEach(doc => {
            const company: Company = {
              id: doc.id,
              name: doc.data().name,
              orgNumber: doc.data().orgNumber
            };
            companyData.push(company);
          })
        });
      setCompanyList(companyData);
      setClonedCompanyList(companyData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const sortData = (sortMethod: CompanySort) => {
    setSortMethod(sortMethod);
    if (sortMethod.column === "name") {
      if (sortMethod.order === "asc") {
        sortAsc(sortMethod.column);
      } else {
        sortDesc(sortMethod.column)
      }
    } else if (sortMethod.column === "orgNumber") {
      if (sortMethod.order === "asc") {
        sortAsc(sortMethod.column);
      } else {
        sortDesc(sortMethod.column)
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

  const addCompany = () => {

  };

  return (
    <Fragment>
      <PaddingRow>
        <FlexContainer>
          <Input labelValue="Search" type="text" name="search" onFormChange={handleSearchChange} width="300px"
                 value={searchValue}/>
          <Button type="button" text="Add company" onSubmit={addCompany}/>
        </FlexContainer>
      </PaddingRow>
      <ListHeader>
        <span onClick={() => sortData({column: "name", order: sortMethod.order === "asc" ? "desc" : "asc"})}>Name</span>
        <span onClick={() => sortData({
          column: "name",
          order: sortMethod.order === "asc" ? "desc" : "asc"
        })}>Org. number</span>
      </ListHeader>
      {companyList.length > 0 && !loading ?
        companyList.map((company: Company) => {
          return (
            <ListRow key={company.id}>
              <span>{company.name}</span>
              <span>{company.orgNumber}</span>
            </ListRow>
          )
        }) : (
          loading ? (
            <ListRow>
              <LoadingIcon position="relative" left="0" height="30px" width="30px" color="#393e41"/>
            </ListRow>
          ) : (
            <ListRow>
              <span>No companies.</span>
            </ListRow>
          )
        )
      }
    </Fragment>);
};

export default CompanyList;