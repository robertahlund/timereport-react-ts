import firebase from "../config/firebaseConfig";
import {
  AuthObject,
  Expense,
  ExpenseCategory,
  ExpenseListItem
} from "../types/types";
import { getExpenseCategories } from "./expenseCategoryApi";
import _ from "lodash";
import { getEmployees } from "./employeeApi";

const db = firebase.firestore();

export const createExpense = async (expense: Expense): Promise<string> => {
  try {
    const expenseId: string = await db
      .collection("expenses")
      .add(expense)
      .then(async doc => {
        await db
          .collection("expenses")
          .doc(doc.id)
          .update({
            ...expense,
            id: doc.id
          });
        return doc.id;
      });
    return new Promise<string>(resolve => resolve(expenseId));
  } catch (error) {
    console.log(error);
    return new Promise<string>(reject => reject("Error creating expense"));
  }
};

export const updateExpense = async (expense: Expense): Promise<void> => {
  try {
    await db
      .collection("expenses")
      .doc(expense.id)
      .update(expense);
  } catch (error) {
    console.log(error);
  }
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  try {
    await db
      .collection("expenses")
      .doc(expenseId)
      .delete();
  } catch (error) {
    console.log(error);
  }
};

export const getExpenseById = async (
  expenseId: string
): Promise<Expense | undefined> => {
  try {
    const expenseCategories:
      | ExpenseCategory[]
      | undefined = await getExpenseCategories();
    if (expenseCategories) {
      const expense: Expense | undefined = await db
        .collection("expenses")
        .doc(expenseId)
        .get()
        .then(doc => {
          if (doc.exists) {
            return doc.data() as Expense;
          } else return undefined;
        });
      if (expense) {
        return new Promise<Expense>(resolve => resolve(expense));
      } else {
        return new Promise<undefined>(reject => reject(undefined));
      }
    } else {
      return new Promise<undefined>(reject => reject(undefined));
    }
  } catch (error) {
    console.log(error);
    return new Promise<undefined>(reject => reject(undefined));
  }
};

export const getExpenses = async (): Promise<ExpenseListItem[] | undefined> => {
  try {
    const expenseCategories:
      | ExpenseCategory[]
      | undefined = await getExpenseCategories();
    const users: AuthObject[] | string = await getEmployees();
    if (expenseCategories && typeof users !== "string") {
      const expenses: ExpenseListItem[] = [];
      await db
        .collection("expenses")
        .get()
        .then(documents => {
          documents.forEach(document => {
            let expenseListItem: ExpenseListItem = document.data() as ExpenseListItem;
            const expenseCategoryName: string | undefined = _.find(
              expenseCategories,
              (category: ExpenseCategory) =>
                category.id === expenseListItem.expenseCategoryId
            )!.name;
            if (expenseCategoryName) {
              expenseListItem.expenseCategoryName = expenseCategoryName;
            } else expenseListItem.expenseCategoryName = "Deleted Category";
              const username: string | undefined = _.find(
                  users,
                  (user: AuthObject) =>
                      user.uid === expenseListItem.userId
              )!.firstName;
              if (username) {
                  expenseListItem.username = username;
              } else expenseListItem.username = "Deleted User";
            expenses.push(expenseListItem);
          });
        });
      return new Promise<ExpenseListItem[]>(resolve => resolve(expenses));
    } else return new Promise<undefined>(reject => reject(undefined));
  } catch (error) {
    console.log(error);
    return new Promise<undefined>(reject => reject(undefined));
  }
};
