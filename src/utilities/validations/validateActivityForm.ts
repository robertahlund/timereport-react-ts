import {ActivityFormValue} from "../../types/types";
import {validateInputField} from "./validateRegisterForm";

export const validateActivityForm = (form: ActivityFormValue): ActivityFormValue => {
    form.name = validateInputField(form.name);
    form.valid = form.name.valid;
    return form;
};
