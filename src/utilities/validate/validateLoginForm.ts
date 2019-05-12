import { LoginFormValue } from "../../types/types";
import {validateEmail, validatePassword} from "./validateRegisterForm";

export const validateLoginForm = (form: LoginFormValue): LoginFormValue => {
  form.email = validateEmail(form.email);
  form.password = validatePassword(form.password);
  form.valid = form.email.valid && form.password.valid;
  return form;
};
