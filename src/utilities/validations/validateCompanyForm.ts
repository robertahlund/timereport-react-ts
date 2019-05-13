import { CompanyFormValue, FormValue } from "../../types/types";
import { validateInputField } from "./validateRegisterForm";
import _ from "lodash";

export const validateCompanyForm = (
  form: CompanyFormValue
): CompanyFormValue => {
  form.name = validateInputField(form.name);
  form.orgNumber = validateOrgNumber(form.orgNumber);
  form.valid = form.name.valid && form.orgNumber.valid;
  return form;
};

export const validateOrgNumber = (orgNumber: FormValue): FormValue => {
  const orgNrRegex: RegExp = /([5]\d{5}[-]\d{4})|([5]\d{9}\s)/g;
  const isValid: boolean =
    !_.isNil(orgNumber.value) &&
    orgNumber.value.length > 0 &&
    orgNrRegex.test(orgNumber.value.toLowerCase());
  let validationMessage: string = "";
  if (!isValid) {
    validationMessage = "Org. number is not correct.";
  }
  return {
    value: orgNumber.value,
    validationMessage: validationMessage,
    valid: isValid
  };
};
