import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import { PaddingRow } from "../authentication/LoginForm";
import Input from "../general/Input";
import Button from "../general/Button";
import { ListHeader, ListRow } from "../employees/EmployeeList";
import LoadingIcon from "../../icons/LoadingIcon";
import { FlexContainer } from "../companies/CompanyList";
import {
  ExpenseCategory,
  ExpenseCategorySort
} from "../../types/types";
import ExpenseCategoryModal from "./ExpenseCategoryModal";
import ModalPortal from "../general/ModalPortal";
import { getExpenseCategories } from "../../api/expenseCategoryApi";
import _ from "lodash";

const ExpenseCategoriesList: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState("");
  const initialSortState: ExpenseCategorySort = {
    column: "name",
    order: "asc"
  };
  const [sortMethod, setSortMethod] = useState(initialSortState);
  const [loading, setLoading] = useState(false);
  const initialExpenseCategoryListState: ExpenseCategory[] = [];
  const [expenseCategoryList, setExpenseCategoryList] = useState(
    initialExpenseCategoryListState
  );
  const [clonedExpenseCategoryList, setClonedExpenseCategoryList] = useState(
    initialExpenseCategoryListState
  );
  const [showExpenseCategoryModal, setShowExpenseCategoryModal] = useState(
    false
  );
  const [expenseCategoryId, setExpenseCategoryId] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { target } = event;
    setSearchValue(target.value);
    if (target.value === "") {
      setExpenseCategoryList(clonedExpenseCategoryList);
      return;
    }
    let searchList: ExpenseCategory[];
    searchList = clonedExpenseCategoryList.filter(
      expenseCategory =>
        expenseCategory.name.toLowerCase().indexOf(target.value.toLowerCase()) >
        -1
    );
    setExpenseCategoryList(searchList);
  };

  const getAllExpenseCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      const expenseCategoryData:
        | ExpenseCategory[]
        | undefined = await getExpenseCategories();
      if (expenseCategoryData) {
        setExpenseCategoryList(expenseCategoryData);
        setClonedExpenseCategoryList(expenseCategoryData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getAllExpenseCategories();
  }, []);

  const sortData = (sortMethod: ExpenseCategorySort) => {
    setSortMethod(sortMethod);
    if (sortMethod.column === "name") {
      if (sortMethod.order === "asc") {
        sortAsc(sortMethod.column);
      } else {
        sortDesc(sortMethod.column);
      }
    }
  };

  const sortAsc = (column: "name"): void => {
    const listToSort: ExpenseCategory[] = _.cloneDeep(expenseCategoryList);
    listToSort.sort((a: ExpenseCategory, b: ExpenseCategory): number => {
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
    setExpenseCategoryList(listToSort);
    setClonedExpenseCategoryList(listToSort);
  };

  const sortDesc = (column: "name"): void => {
    const listToSort: ExpenseCategory[] = _.cloneDeep(expenseCategoryList);
    listToSort.sort((a: ExpenseCategory, b: ExpenseCategory): number => {
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
    setExpenseCategoryList(listToSort);
    setClonedExpenseCategoryList(listToSort);
  };

  const toggleExpenseCategoryModal = (event?: React.MouseEvent): void => {
    if (event) {
      const { target, currentTarget } = event;
      if (target === currentTarget) {
        setShowExpenseCategoryModal(!showExpenseCategoryModal);
      }
    } else setShowExpenseCategoryModal(!showExpenseCategoryModal);
  };

  const selectExpenseCategory = (expenseCategoryId: string): void => {
    setExpenseCategoryId(expenseCategoryId);
    toggleExpenseCategoryModal();
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
            text="Add expense category"
            onSubmit={() => selectExpenseCategory("")}
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
      </ListHeader>
      {expenseCategoryList.length > 0 && !loading ? (
        expenseCategoryList.map((expenseCategory: ExpenseCategory) => {
          return (
            <ListRow
              key={expenseCategory.id}
              onClick={() => selectExpenseCategory(expenseCategory.id)}
            >
              <span>{expenseCategory.name}</span>
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
          <span>No expense categories.</span>
        </ListRow>
      )}
      {showExpenseCategoryModal && (
        <ModalPortal>
          <ExpenseCategoryModal
            expenseCategoryId={expenseCategoryId}
            toggleModal={toggleExpenseCategoryModal}
            getExpenseCategories={getAllExpenseCategories}
          />
        </ModalPortal>
      )}
    </Fragment>
  );
};

export default ExpenseCategoriesList;
