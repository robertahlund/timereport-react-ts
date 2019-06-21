import {ExpenseFormValue, FormValue} from "../../types/types";
import {validateInputField} from "./validateRegisterForm";

export const validateExpenseForm = (
    form: ExpenseFormValue
): ExpenseFormValue => {
    form.amount = validateInputField(form.amount) && validateNumberField(form.amount);
    form.vat = validateInputField(form.vat) && validateNumberField(form.vat);
    form.valid = form.amount.valid && form.vat.valid;
    //TODO should validate upladed file aswell
    return form;
};

export const validateNumberField = (field: FormValue): FormValue => {
    const isValid: boolean = Boolean(Number(field.value));
    let validationMessage: string = "";
    if (!isValid) {
      validationMessage = "Only numbers allowed."
    }
    return {
      value: field.value,
      validationMessage: validationMessage,
      valid: isValid
    }
  };