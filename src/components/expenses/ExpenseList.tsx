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
import AttachmentIcon from "../../icons/AttachmentIcon";
import styled from "styled-components";

const ExpenseList: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const initialSortState: ExpenseSort = {
    column: "username",
    order: "asc"
  };
  const [sortMethod, setSortMethod] = useState<ExpenseSort>(initialSortState);
  const [loading, setLoading] = useState<boolean>(false);
  const initialExpenseListState: ExpenseListItem[] = [];
  const [expenseList, setExpenseList] = useState<ExpenseListItem[]>(initialExpenseListState);
  const [clonedExpenseList, setClonedExpenseList] = useState<ExpenseListItem[]>(
    initialExpenseListState
  );
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [expenseId, setExpenseId] = useState<string>("");

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
      const expenseData: ExpenseListItem[] = await getExpenses();
      console.log(expenseData);
      setExpenseList(expenseData);
      setClonedExpenseList(expenseData);
      setLoading(false);
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
    listToSort.sort(
      (a: ExpenseListItem, b: ExpenseListItem): number => {
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
    setExpenseList(listToSort);
    setClonedExpenseList(listToSort);
  };

  const sortDesc = (column: "username"): void => {
    const listToSort: ExpenseListItem[] = _.cloneDeep(expenseList);
    listToSort.sort(
      (a: ExpenseListItem, b: ExpenseListItem): number => {
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

  const selectExpense = (expenseId: string, event?: React.MouseEvent): void => {
    setExpenseId(expenseId);
    toggleExpenseModal(event);
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
            text="Add expense"
            onSubmit={() => selectExpense("")}
          />
        </FlexContainer>
      </PaddingRow>
      <ExpenseListHeader>
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
        <span>Category</span>
        <span>Amount</span>
        <span>VAT</span>
        <span>Receipt</span>
      </ExpenseListHeader>
      {expenseList.length > 0 && !loading ? (
        expenseList.map((expense: ExpenseListItem) => {
          return (
            <ExpenseListRow
              key={expense.id}
              onClick={(event: React.MouseEvent) =>
                selectExpense(expense.id, event)
              }
            >
              <VerticalCenterSpan
                onClick={(event: React.MouseEvent) =>
                  selectExpense(expense.id, event)
                }
              >
                {expense.username}
              </VerticalCenterSpan>
              <VerticalCenterSpan
                onClick={(event: React.MouseEvent) =>
                  selectExpense(expense.id, event)
                }
              >
                {expense.expenseCategoryName}
              </VerticalCenterSpan>
              <VerticalCenterSpan
                onClick={(event: React.MouseEvent) =>
                  selectExpense(expense.id, event)
                }
              >
                {expense.amount}
              </VerticalCenterSpan>
              <VerticalCenterSpan
                onClick={(event: React.MouseEvent) =>
                  selectExpense(expense.id, event)
                }
              >
                {expense.vat}
              </VerticalCenterSpan>
              <VerticalCenterSpan
                onClick={(event: React.MouseEvent) =>
                  selectExpense(expense.id, event)
                }
              >
                <a
                  href={expense.receiptUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AttachmentIcon
                    height="24px"
                    width="24px"
                    color="#fff"
                    backgroundColor="#fec861"
                  />
                </a>
              </VerticalCenterSpan>
            </ExpenseListRow>
          );
        })
      ) : loading ? (
        <ExpenseListRow>
          <LoadingIcon
            position="relative"
            left="0"
            height="30px"
            width="30px"
            color="#393e41"
          />
        </ExpenseListRow>
      ) : (
        <ExpenseListRow>
          <span>No expenses.</span>
        </ExpenseListRow>
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

const VerticalCenterSpan = styled.span`
  display: flex;
  align-items: center;
  &:last-child {
    justify-content: flex-end;
  }
`;

const ExpenseListRow = styled(ListRow)`
  span {
    cursor: pointer;
    width: 25%;
  }
  span:first-child {
    width: 40%;
  }
  span:last-child:not(:first-child) {
    text-align: right;
  }
`;

const ExpenseListHeader = styled(ListHeader)`
  span {
    cursor: pointer;
    width: 25%;
  }
  span:first-child {
    width: 40%;
  }
  span:last-child:not(:first-child) {
    text-align: right;
  }
`;
