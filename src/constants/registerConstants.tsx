import {RegisterFormValue} from "../types/types";

export const initialRegisterForm: RegisterFormValue = {
  valid: true,
  firstName: {
    value: "",
    valid: true,
    validationMessage: ""
  },
  lastName: {
    value: "",
    valid: true,
    validationMessage: ""
  },
  email: {
    value: "",
    valid: true,
    validationMessage: ""
  },
  password: {
    value: "",
    valid: true,
    validationMessage: ""
  }
};