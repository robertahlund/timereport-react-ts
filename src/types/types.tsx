export interface DateSelectorValue {
  from: string;
  to: string;
}

export interface TimeReportRow {
  date: Date;
  prettyDate: string;
  hours: string;
}

export interface TimeReport {
  id: string;
  userId: string;
  date: Date;
  prettyDate: string;
  activityId: string;
  activityName?: string;
  companyId: string;
  companyName?: string;
  timeReportRows: TimeReportRow[];
}

export interface TimeReportRowSummary {
  total: number;
}

export interface TimeReportSummary {
  total: number;
  rowTotals: TimeReportRowSummary[];
}

export type DateSelectorStartValueFormatType = "LLL' 'd";
export type DateSelectorEndValueFormatType = "' - 'LLL' 'd', 'y";
export type TimeStampFormat = "HH':'mm':'ss";
export type TimeReportDateFormat = "y-MM-dd";

export interface UserCompanies {
  value: string;
  label: string;
}

export type UserRoles = "Administrator" | "Employee";

export interface AuthObject {
  firstName?: string;
  lastName?: string;
  uid?: string;
  email?: string;
  roles?: UserRoles[];
  isAdmin?: boolean;
  inactive?: boolean;
  companies?: UserCompanies[];
}

export interface EmployeeForm {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface CompanySelectOptions {
  value: string;
  label: string;
}

export type EmployeeCompanyList = CompanySelectOptions[];
export type CompanyColumn = "name" | "orgNumber";

export type EmployeeColumn = "name" | "email";
export type Order = "asc" | "desc";

export interface CompanySort {
  column: CompanyColumn;
  order: Order;
}

export interface Activity {
  id: string;
  name: string;
}

export interface ActivityCompanySelectOption {
  value: string;
  label: string;
  companyId: string;
  companyName: string;
}

export interface ActivitySelectOptions {
  value: string;
  label: string;
}

export interface FormValue {
  value: string;
  valid: boolean;
  validationMessage: string;
}

export interface Company {
  id: string;
  name: string;
  orgNumber: string;
  activities: ActivitySelectOptions[];
}

export interface CompanyFormValue {
  id: string;
  valid: boolean;
  name: FormValue;
  orgNumber: FormValue;
}

export interface EmployeeFormValue {
  uid: string;
  valid: boolean;
  firstName: FormValue;
  lastName: FormValue;
  email: FormValue;
}

export interface EmployeeRow {
  name: string;
  uid: string;
  email: string;
  roles: UserRoles[];
  companies: EmployeeCompanyList;
}

export interface EmployeeSort {
  column: EmployeeColumn;
  order: Order;
}

export interface RegisterFormValue {
  valid: boolean;
  firstName: FormValue;
  lastName: FormValue;
  email: FormValue;
  password: FormValue;
}

export type ButtonType = "Create" | "Delete";

export interface GroupedActivityOptions {
  label: string;
  companyId: string;
  options: ActivityCompanySelectOption[];
}

export interface LoginFormValue {
  valid: boolean;
  email: FormValue,
  password: FormValue
}

export interface ActivityFormValue {
  id: string;
  valid: boolean;
  name: FormValue
}