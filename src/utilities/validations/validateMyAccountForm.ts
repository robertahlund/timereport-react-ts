import {RegisterFormValue} from "../../types/types";
import {validateEmail, validateInputField, validatePassword} from "./validateRegisterForm";

export const validateMyAccountForm = (
  form: RegisterFormValue,
  _validatePassword?: boolean
): RegisterFormValue => {
  form.firstName = validateInputField(form.firstName);
  form.lastName = validateInputField(form.lastName);
  form.email = validateEmail(form.email);
  _validatePassword ? form.password = validatePassword(form.password) : form.password.valid = true;
  form.valid = form.firstName.valid && form.lastName.valid && form.email.valid && form.password.valid;
  return form;
};