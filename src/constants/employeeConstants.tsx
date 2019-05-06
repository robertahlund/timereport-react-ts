import {EmployeeRow, EmployeeSort} from "../types/types";

export const initialEmployeeState: EmployeeRow[] = [];
export const initialSortState: EmployeeSort = {
  column: "name",
  order: "asc"
};