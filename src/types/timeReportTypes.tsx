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

export type DateSelectorStartValueFormatType = "MMM[ ]D";
export type DateSelectorEndValueFormatType = "[ - ]MMM[ ]D[, ]YYYY";
export type TimeStampFormat = "HH[:]mm[:]ss";
export type TimeReportDateFormat = "YYYY-MM-DD";