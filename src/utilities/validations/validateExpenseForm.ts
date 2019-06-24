import {ExpenseFormValue, FormValue} from "../../types/types";
import {validateInputField} from "./validateRegisterForm";
import _ from "lodash";

export const validateExpenseForm = (
  form: ExpenseFormValue
): ExpenseFormValue => {
  form.amount = validateInputField(form.amount) && validateNumberField(form.amount);
  form.vat = validateInputField(form.vat) && validateNumberField(form.vat);
  form.date = validateDate(form.date);
  form.valid = form.amount.valid && form.vat.valid && form.date.valid;
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

export const validateDate = (date: FormValue): FormValue => {
  const dateRegex: RegExp = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  const isValid: boolean = !_.isNil(date.value) && date.value.length > 0 && dateRegex.test(date.value.toLowerCase());
  console.log(date, isValid)
  let validationMessage: string = "";
  if (!isValid) {
    validationMessage = "Date format is not correct."
  }
  return {
    value: date.value,
    validationMessage: validationMessage,
    valid: isValid
  }
};