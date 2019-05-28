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
import { ExpenseListItem, ExpenseSort } from "../../types/types";
import ExpenseModal from "./ExpenseModal";
import ModalPortal from "../general/ModalPortal";
import _ from "lodash";
import { getExpenses } from "../../api/expenseApi";

const ExpenseList: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState("");
  const initialSortState: ExpenseSort = {
    column: "username",
    order: "asc"
  };
  const [sortMethod, setSortMethod] = useState(initialSortState);
  const [loading, setLoading] = useState(false);
  const initialExpenseListState: ExpenseListItem[] = [];
  const [expenseList, setExpenseList] = useState(initialExpenseListState);
  const [clonedExpenseList, setClonedExpenseList] = useState(
    initialExpenseListState
  );
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseId, setExpenseId] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { target } = event;
    setSearchValue(target.value);
    if (target.value === "") {
      setExpenseList(clonedExpenseList);
      return;
    }
    let searchList: ExpenseListItem[];
    searchList = clonedExpenseList.filter(
      expense =>
        expense.username.toLowerCase().indexOf(target.value.toLowerCase()) > -1
    );
    setExpenseList(searchList);
  };

  const _getExpenses = async (): Promise<void> => {
    setLoading(true);
    try {
      const expenseCategoryData:
        | ExpenseListItem[]
        | undefined = await getExpenses();
      if (expenseCategoryData) {
        setExpenseList(expenseCategoryData);
        setClonedExpenseList(expenseCategoryData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    _getExpenses();
  }, []);

  const sortData = (sortMethod: ExpenseSort) => {
    setSortMethod(sortMethod);
    if (sortMethod.column === "username") {
      if (sortMethod.order === "asc") {
        sortAsc(sortMethod.column);
      } else {
        sortDesc(sortMethod.column);
      }
    }
  };

  const sortAsc = (column: "username"): void => {
    const listToSort: ExpenseListItem[] = _.cloneDeep(expenseList);
    listToSort.sort((a: ExpenseListItem, b: ExpenseListItem): number => {
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
    setExpenseList(listToSort);
    setClonedExpenseList(listToSort);
  };

  const sortDesc = (column: "username"): void => {
    const listToSort: ExpenseListItem[] = _.cloneDeep(expenseList);
    listToSort.sort((a: ExpenseListItem, b: ExpenseListItem): number => {
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
    setExpenseList(listToSort);
    setClonedExpenseList(listToSort);
  };

  const toggleExpenseModal = (event?: React.MouseEvent): void => {
    if (event) {
      const { target, currentTarget } = event;
      if (target === currentTarget) {
        setShowExpenseModal(!showExpenseModal);
      }
    } else setShowExpenseModal(!showExpenseModal);
  };

  const selectExpense = (expenseId: string): void => {
    setExpenseId(expenseId);
    toggleExpenseModal();
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
            onSubmit={() => selectExpense("")}
          />
        </FlexContainer>
      </PaddingRow>
      <ListHeader>
        <span
          onClick={() =>
            sortData({
              column: "username",
              order: sortMethod.order === "asc" ? "desc" : "asc"
            })
          }
        >
          Name
        </span>
      </ListHeader>
      {expenseList.length > 0 && !loading ? (
        expenseList.map((expense: ExpenseListItem) => {
          return (
            <ListRow key={expense.id} onClick={() => selectExpense(expense.id)}>
              <span>{expense.username}</span>
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
          <span>No expenses.</span>
        </ListRow>
      )}
      {showExpenseModal && (
        <ModalPortal>
          <ExpenseModal
            expenseId={expenseId}
            toggleModal={toggleExpenseModal}
            getExpenses={_getExpenses}
          />
        </ModalPortal>
      )}
    </Fragment>
  );
};

export default ExpenseList;
