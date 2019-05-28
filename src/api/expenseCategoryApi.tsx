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
    return new Promise<string>(resolve => resolve(expenseCategoryId));
  } catch (error) {
    console.log(error);
    return new Promise<string>(reject =>
      reject("Error creating expense category")
    );
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
): Promise<ExpenseCategory | undefined> => {
  try {
    const expenseCategory: ExpenseCategory | undefined = await db
      .collection("expenseCategories")
      .doc(expenseCategoryId)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data() as ExpenseCategory;
        } else return undefined;
      });
    if (expenseCategory) {
      return new Promise<ExpenseCategory>(resolve => resolve(expenseCategory));
    } else {
      return new Promise<undefined>(reject => reject(undefined));
    }
  } catch (error) {
    console.log(error);
    return new Promise<undefined>(reject => reject(undefined));
  }
};

export const getExpenseCategories = async (): Promise<
  ExpenseCategory[] | undefined
> => {
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
    return new Promise<ExpenseCategory[]>(resolve =>
      resolve(expenseCategories)
    );
  } catch (error) {
    console.log(error);
    return new Promise<undefined>(reject => reject(undefined));
  }
};
