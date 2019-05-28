import {ExpenseCategoryFormValue} from "../../types/types";
import {validateInputField} from "./validateRegisterForm";

export const validateExpenseCategoryForm = (form: ExpenseCategoryFormValue): ExpenseCategoryFormValue => {
    form.name = validateInputField(form.name);
    form.valid = form.name.valid;
    return form;
};
