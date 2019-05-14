import {EmployeeFormValue, EmployeeRow, EmployeeSort, LoginFormValue} from "../types/types";

export const initialEmployeeState: EmployeeRow[] = [];
export const initialSortState: EmployeeSort = {
  column: "name",
  order: "asc"
};
export const initialLoginFormState: LoginFormValue = {
  valid: true,
  email: {
    valid: true,
    validationMessage: "",
    value: ""
  },
  password: {
    valid: true,
    validationMessage: "",
    value: ""
  }
};
export const initialEmployeeFormState: EmployeeFormValue = {
    uid: "",
    valid: true,
    firstName: {
      valid: true,
      validationMessage: "",
      value: ""
    },
    lastName: {
      valid: true,
      validationMessage: "",
      value: ""
    },
    email: {
      valid: true,
      validationMessage: "",
      value: ""
    }
  }
