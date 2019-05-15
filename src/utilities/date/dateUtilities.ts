import {FirstAndLastDate} from "../../types/types";
import {endOfMonth, startOfMonth, startOfWeek} from "date-fns";

export const getFirstAndLastDateOfMonth = (date: Date): FirstAndLastDate => {
  return {
    first: startOfMonth(date),
    last: endOfMonth(date)
  }
};

export const getFirstAndLastDateOfWeek = (date: Date): FirstAndLastDate => {
  return {
    first: startOfWeek(date),
    last: startOfWeek(date)
  }
};