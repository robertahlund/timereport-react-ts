import {ExpenseFormValue} from "../../types/types";
import {validateInputField} from "./validateRegisterForm";

export const validateExpenseForm = (
    form: ExpenseFormValue
): ExpenseFormValue => {
    form.amount = validateInputField(form.amount);
    form.vat = validateInputField(form.vat);
    form.valid = form.amount.valid && form.vat.valid;
    //TODO should validate upladed file aswell
    return form;
};