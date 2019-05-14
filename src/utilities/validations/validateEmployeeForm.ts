import {EmployeeFormValue} from "../../types/types";
import {validateEmail, validateInputField} from "./validateRegisterForm";

export const validateEmployeeForm = (
  form: EmployeeFormValue
): EmployeeFormValue => {
  form.firstName = validateInputField(form.firstName);
  form.lastName = validateInputField(form.lastName);
  form.email = validateEmail(form.email);
  form.valid = form.firstName.valid && form.lastName.valid && form.email.valid;
  return form;
};