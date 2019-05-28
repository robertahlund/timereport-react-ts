import {ExpenseCategoryFormValue, ExpenseFormValue, FormValue} from "../types/types";

export const initialExpenseCategoryForm: ExpenseCategoryFormValue = {
    id: "",
    name: {
        validationMessage: "",
        value: "",
        valid: true
    },
    valid: true
};

export const initialExpenseForm: ExpenseFormValue = {
    id: "",
    userId: "",
    valid: true,
    expenseCategoryId: "",
    amount: {
        validationMessage: "",
        value: "",
        valid: true
    },
    vat: {
        validationMessage: "",
        value: "",
        valid: true
    },
    note: {
        validationMessage: "",
        value: "",
        valid: true
    },
    receiptUrl: ""
};