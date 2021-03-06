import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import {PaddingRow} from "../authentication/LoginForm";
import Input from "../general/Input";
import LoadingIcon from "../../icons/LoadingIcon";
import {ListHeader, ListRow} from "../employees/EmployeeList";
import Button from "../general/Button";
import styled from "styled-components";
import _ from "lodash";
import {CompanyColumn, Company, CompanySort} from "../../types/types";
import CompanyModal from "./CompanyModal";
import {getCompanies} from "../../api/companyApi";
import ModalPortal from "../general/ModalPortal";
import {initialSortState} from "../../constants/companyConstants";
import {toast} from "react-toastify";

const CompanyList: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<CompanySort>(initialSortState);
  const [loading, setLoading] = useState<boolean>(false);
  const initialCompanyListState: Company[] = [];
  const [companyList, setCompanyList] = useState<Company[]>(initialCompanyListState);
  const [clonedCompanyList, setClonedCompanyList] = useState<Company[]>(
    initialCompanyListState
  );
  const [showCompanyModal, setShowCompanyModal] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<string>("");

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getAllCompanies();
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const {target} = event;
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

  const getAllCompanies = async (): Promise<void> => {
    try {
      setLoading(true);
      const companyData: Company[] = await getCompanies();
      setCompanyList(companyData);
      setClonedCompanyList(companyData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  };

  const sortData = (sortMethod: CompanySort) => {
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

  const sortAsc = (column: CompanyColumn): void => {
    const listToSort: Company[] = _.cloneDeep(companyList);
    listToSort.sort(
      (a: Company, b: Company): number => {
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
    setCompanyList(listToSort);
    setClonedCompanyList(listToSort);
  };

  const sortDesc = (column: CompanyColumn): void => {
    const listToSort: Company[] = _.cloneDeep(companyList);
    listToSort.sort(
      (a: Company, b: Company): number => {
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
    setCompanyList(listToSort);
    setClonedCompanyList(listToSort);
  };

  const toggleCompanyModal = (event?: React.MouseEvent): void => {
    if (event) {
      const {target, currentTarget} = event;
      if (target === currentTarget) {
        setShowCompanyModal(!showCompanyModal);
      }
    } else setShowCompanyModal(!showCompanyModal);
  };

  const selectCompany = (companyId: string): void => {
    setCompanyId(companyId);
    toggleCompanyModal();
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
            onSubmit={() => selectCompany("")}
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
            <ListRow key={company.id} onClick={() => selectCompany(company.id)}>
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
      {showCompanyModal && (
        <ModalPortal>
          <CompanyModal
            companyId={companyId}
            toggleModal={toggleCompanyModal}
            getAllCompanies={getAllCompanies}
          />
        </ModalPortal>
      )}
    </Fragment>
  );
};

export default CompanyList;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
