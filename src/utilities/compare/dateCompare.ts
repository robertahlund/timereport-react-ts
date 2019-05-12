import {dateSelectorStartValueFormat} from "../../constants/timeReportConstants";
import {format} from "date-fns";

export const dateCompare = (firstDate: Date, lastDate: Date): boolean => {
  const firstDateFormat: string = format(firstDate, dateSelectorStartValueFormat);
  const lastDateFormat: string = format(lastDate, dateSelectorStartValueFormat);

  if (firstDateFormat === lastDateFormat) {
    //same year, month and day
    console.log(firstDateFormat, lastDateFormat)
    if (firstDate.getHours() === lastDate.getHours() && firstDate.getMinutes() === lastDate.getMinutes()) {
      //same year, month, day and hour
      return true;
    }
    return false;
  } else return false;
};