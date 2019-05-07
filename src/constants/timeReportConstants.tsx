import {format} from "date-fns";
import {
  ActivityCompanySelectOption,
  DateSelectorEndValueFormatType,
  DateSelectorStartValueFormatType, DateSelectorValue, GroupedActivityOptions, TimeReport,
  TimeReportDateFormat, TimeReportSummary,
  TimeStampFormat
} from "../types/types";

export const dateSelectorStartValueFormat: DateSelectorStartValueFormatType = "LLL' 'd";
export const dateSelectorEndValueFormat: DateSelectorEndValueFormatType = "' - 'LLL' 'd', 'y";
export const timeStampFormat: TimeStampFormat = "HH':'mm':'ss";
export const timeReportDateFormat: TimeReportDateFormat = "y-MM-dd";
export const initialTimeReportRows: TimeReport[] = [];
export const initialTotal: TimeReportSummary = {
    total: 0,
    rowTotals: [
        {total: 0},
        {total: 0},
        {total: 0},
        {total: 0},
        {total: 0},
        {total: 0},
        {total: 0}
    ]
};
export const initialActivitySelect: GroupedActivityOptions[] = [];
export const awareOfUnicodeTokens = {
  awareOfUnicodeTokens: true
};
export const initialDateSelectorValue: DateSelectorValue = {
    from: format(new Date(), dateSelectorStartValueFormat),
    to: format(new Date(), dateSelectorEndValueFormat)
};
