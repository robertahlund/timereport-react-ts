import firebase from "../config/firebaseConfig";
import { ExpenseCategory } from "../types/types";

const db = firebase.firestore();

export const createExpenseCategory = async (
  expenseCategory: ExpenseCategory
): Promise<string> => {
  try {
    const expenseCategoryId: string = await db
      .collection("expenseCategories")
      .add(expenseCategory)
      .then(async doc => {
        await db
          .collection("expenseCategories")
          .doc(doc.id)
          .update({
            ...expenseCategory,
            id: doc.id
          });
        return doc.id;
      });
    return Promise.resolve(expenseCategoryId);
  } catch (error) {
    console.log(error);
    return Promise.reject("Error creating expense category");
  }
};

export const updateExpenseCategory = async (
  expenseCategory: ExpenseCategory
): Promise<void> => {
  try {
    await db
      .collection("expenseCategories")
      .doc(expenseCategory.id)
      .update(expenseCategory);
  } catch (error) {
    console.log(error);
  }
};

export const deleteExpenseCategory = async (
  expenseCategoryId: string
): Promise<void> => {
  try {
    await db
      .collection("expenseCategories")
      .doc(expenseCategoryId)
      .delete();
  } catch (error) {
    console.log(error);
  }
};

export const getExpenseCategoryById = async (
  expenseCategoryId: string
): Promise<ExpenseCategory> => {
  try {
    const expenseCategory: ExpenseCategory | null = await db
      .collection("expenseCategories")
      .doc(expenseCategoryId)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data() as ExpenseCategory;
        } else return null;
      });
    if (expenseCategory) {
      return Promise.resolve(expenseCategory);
    } else {
      return Promise.reject("Could not find a expense category with that id");
    }
  } catch (error) {
    console.log(error);
    return Promise.reject("Error retrieving expense category");
  }
};

export const getExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  try {
    const expenseCategories: ExpenseCategory[] = [];
    await db
      .collection("expenseCategories")
      .orderBy("name", "asc")
      .get()
      .then(documents => {
        documents.forEach(document => {
          expenseCategories.push(document.data() as ExpenseCategory);
        });
      });
    return Promise.resolve(expenseCategories);
  } catch (error) {
    console.log(error);
    return Promise.reject("Error retrieving expense categories");
  }
};
