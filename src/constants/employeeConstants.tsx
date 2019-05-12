import {EmployeeRow, EmployeeSort, LoginFormValue} from "../types/types";

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