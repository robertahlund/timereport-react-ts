import { Company, CompanyFormValue, CompanySort } from "../types/types";

export const initialSortState: CompanySort = {
  column: "name",
  order: "asc"
};

export const initialCompanyState: CompanyFormValue = {
  id: "",
  valid: true,
  name: {
    value: "",
    valid: true,
    validationMessage: ""
  },
  orgNumber: {
    value: "",
    valid: true,
    validationMessage: ""
  }
};
