import {FormValue, RegisterFormValue} from "../types/types";
import _ from "lodash";

export const validateRegisterForm = (form: RegisterFormValue): RegisterFormValue => {
  form.firstName = validateInputField(form.firstName!);
  form.lastName = validateInputField(form.lastName!);
  form.email = validateEmail(form.email!);
  form.password = validatePassword(form.password!);
  form.valid = form.firstName.valid && form.lastName.valid && form.email.valid && form.password.valid;
  return form;
};

const validateEmail = (email: FormValue): FormValue => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid: boolean = !_.isNil(email.value) && email.value.length > 0 && emailRegex.test(email.value.toLowerCase());
  let validationMessage: string = "";
  if (!isValid) {
    validationMessage = "Email is not correct."
  }
  return {
    value: email.value,
    validationMessage: validationMessage,
    valid: isValid
  }
};

const validateInputField = (field: FormValue): FormValue => {
  const isValid: boolean = !_.isNil(field.value) && field.value.length > 0;
  let validationMessage: string = "";
  if (!isValid) {
    validationMessage = "You must enter a value."
  }
  return {
    value: field.value,
    validationMessage: validationMessage,
    valid: isValid
  }
};

const validatePassword = (password: FormValue): FormValue => {
  const isValid: boolean = !_.isNil(password.value) && password.value.length >= 6;
  let validationMessage: string = "";
  if (!isValid) {
    validationMessage = "Password must be 6 characters or longer."
  }
  return {
    value: password.value,
    validationMessage: validationMessage,
    valid: isValid
  }
};