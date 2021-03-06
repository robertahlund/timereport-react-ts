import firebase from "../config/firebaseConfig";
import {
  AuthObject,
  Expense,
  ExpenseCategory,
  ExpenseFileUpload,
  ExpenseListItem
} from "../types/types";
import { getExpenseCategories } from "./expenseCategoryApi";
import _ from "lodash";
import { getEmployees } from "./employeeApi";
import uuidv4 from "uuid";


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
    return Promise.resolve(expenseId);
  } catch (error) {
    console.log(error);
    return Promise.reject("Error creating expense");
  }
};

export const uploadExpenseFile = async (
  file: File,
  isUpdate?: boolean,
  originalFilename?: string
): Promise<ExpenseFileUpload> => {
  try {
    console.log(file);
    const storageService = firebase.storage();
    const storageRef = storageService.ref();
    let fileUrl: string = "";
    if (isUpdate && originalFilename) {
      await deleteExpenseFile(originalFilename);
    }
    const filename: string =
      file.name.split(".")[0] + uuidv4() + "." + file.name.split(".")[1];
    await storageRef
      .child(`receipts/${filename}`)
      .put(file)
      .then(async snapshot => {
        await snapshot.ref.getDownloadURL().then(url => {
          fileUrl = url;
        });
      });
    return Promise.resolve({ url: fileUrl, filename });
  } catch (error) {
    console.log(error);
    return Promise.reject("Error uploading file");
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

export const deleteExpenseFile = async (filename: string): Promise<void> => {
  try {
    const storageService = firebase.storage();
    const storageRef = storageService.ref();
    await storageRef.child(`receipts/${filename}`).delete();
  } catch (error) {
    console.log(error)
  }
};

export const deleteExpense = async (expenseId: string, filename: string): Promise<void> => {
  try {
    await deleteExpenseFile(filename);
    await db
      .collection("expenses")
      .doc(expenseId)
      .delete();
  } catch (error) {
    console.log(error);
  }
};

export const getExpenseById = async (expenseId: string): Promise<Expense> => {
  try {
    const expenseCategories: ExpenseCategory[] = await getExpenseCategories();
    if (expenseCategories.length > 0) {
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
        return Promise.resolve(expense);
      } else {
        return Promise.reject("No expense found.");
      }
    } else {
      return Promise.reject("No expense categories found.");
    }
  } catch (error) {
    console.log(error);
    return Promise.reject("An error occured.");
  }
};

export const getExpenses = async (): Promise<ExpenseListItem[]> => {
  try {
    const expenseCategories: ExpenseCategory[] = await getExpenseCategories();
    const users: AuthObject[] = await getEmployees();
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
          const firstName: string | undefined = _.find(
            users,
            (user: AuthObject) => user.uid === expenseListItem.userId
          )!.firstName;
          const lastName: string | undefined = _.find(
            users,
            (user: AuthObject) => user.uid === expenseListItem.userId
          )!.lastName;
          if (firstName && lastName) {
            expenseListItem.username = `${firstName} ${lastName}`;
          } else expenseListItem.username = "Deleted User";
          expenses.push(expenseListItem);
        });
      });
    return Promise.resolve(expenses);
  } catch (error) {
    console.log(error);
    return Promise.reject("Error retrieving expenses");
  }
};

export const getExpensesByUserId = async (userId: string): Promise<ExpenseListItem[]> => {
  try {
    const expenseCategories: ExpenseCategory[] = await getExpenseCategories();
    const users: AuthObject[] = await getEmployees();
    const expenses: ExpenseListItem[] = [];
    await db
      .collection("expenses")
      .where("userId", "==", userId)
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
          const firstName: string | undefined = _.find(
            users,
            (user: AuthObject) => user.uid === expenseListItem.userId
          )!.firstName;
          const lastName: string | undefined = _.find(
            users,
            (user: AuthObject) => user.uid === expenseListItem.userId
          )!.lastName;
          if (firstName && lastName) {
            expenseListItem.username = `${firstName} ${lastName}`;
          } else expenseListItem.username = "Deleted User";
          expenses.push(expenseListItem);
        });
      });
    return Promise.resolve(expenses);
  } catch (error) {
    console.log(error);
    return Promise.reject("Error retrieving expenses");
  }
};
