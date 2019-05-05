import {
    DateSelectorEndValueFormatType,
    DateSelectorStartValueFormatType,
    DateSelectorValue,
    TimeReport,
    TimeReportDateFormat,
    TimeReportSummary,
    TimeStampFormat
} from "../types/timeReportTypes";
import {format} from "date-fns";
import {ActivityCompanySelectOption} from "../types/activityTypes";

export const dateSelectorStartValueFormat: DateSelectorStartValueFormatType = "MMM[ ]D";
export const dateSelectorEndValueFormat: DateSelectorEndValueFormatType = "[ - ]MMM[ ]D[, ]YYYY";
export const timeStampFormat: TimeStampFormat = "HH[:]mm[:]ss";
export const timeReportDateFormat: TimeReportDateFormat = "YYYY-MM-DD";
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
export const initialActivitySelect: ActivityCompanySelectOption[] = [];
export const initialDateSelectorValue: DateSelectorValue = {
    from: format(new Date(), dateSelectorStartValueFormat),
    to: format(new Date(), dateSelectorEndValueFormat)
};