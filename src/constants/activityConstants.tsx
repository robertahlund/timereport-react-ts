import {ActivityFormValue} from "../types/types";

export const initialActivityState: ActivityFormValue = {
  id: "",
  valid: true,
  name: {
    valid: true,
    validationMessage: "",
    value: ""
  }
};