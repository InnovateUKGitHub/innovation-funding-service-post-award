import * as React from "react";
import { DateTime } from "luxon";

const convertDateAndTime = (jsDate: Date | null): DateTime | null => {
    return jsDate && DateTime.fromJSDate(jsDate).setZone("Europe/London");
};

const convertDateOnly = (jsDate: Date | null): DateTime | null => {
    return jsDate && DateTime.fromJSDate(jsDate).setZone("Europe/London");
};

const render = (value: DateTime | null, format: string) => {
    if (value && value.isValid) {
        return <span>{value.toFormat(format)}</span>;
    }
    return null;
};

const renderDateRange = ( start: DateTime | null, end: DateTime | null, format: string, isCondensed: boolean = false )=> {
    if (!start || !start.isValid || !end || !end.isValid) {
        return null;
    }

    if (start.month === end.month && start.year === end.year && isCondensed) {
        return <span style={{whiteSpace: "nowrap"}}>{end.toFormat(format + " yyyy")}</span>;
    }

    if (start.year === end.year) {
        return (
            <span>
                <span style={{whiteSpace: "nowrap"}}>{start.toFormat(format)} to </span>
                <span style={{whiteSpace: "nowrap"}}>{end.toFormat(format + " yyyy")}</span>
            </span>
        );
    }

    return (
        <span>
            <span style={{whiteSpace: "nowrap"}}>{start.toFormat(format + " yyyy")} to </span>
            <span style={{whiteSpace: "nowrap"}}>{end.toFormat(format + " yyyy")}</span>
        </span>
    );
};

export const CondensedDateRange: React.FunctionComponent<{ start: Date | null, end: Date | null }> = props => {
    return renderDateRange(convertDateOnly(props.start), convertDateOnly(props.end), "MMM", true);
};

export const LongDateRange: React.FunctionComponent<{ start: Date | null, end: Date | null }> = props => {
    return renderDateRange(convertDateOnly(props.start), convertDateOnly(props.end), "d MMMM");
};

export const ShortDateRange: React.FunctionComponent<{ start: Date | null, end: Date | null }> = props => {
    return renderDateRange(convertDateOnly(props.start), convertDateOnly(props.end), "d MMM");
};

export const ShortMonth: React.FunctionComponent<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "MMM");
};

export const DayAndLongMonth: React.FunctionComponent<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "d MMMM");
};

export const LongYear: React.FunctionComponent<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "yyyy");
};

export const FullDate: React.FunctionComponent<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "d MMMM yyyy");
};

export const FullDateTime: React.FunctionComponent<{ value: Date | null }> = (props) => {
    const date = convertDateAndTime(props.value);
    return render(date, appendMeridian(date, "d MMMM yyyy, h:mm"));
};

export const ShortDate: React.FunctionComponent<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "d MMM yyyy");
};

export const ShortDateTime: React.FunctionComponent<{ value: Date | null }> = (props) => {
    const date = convertDateAndTime(props.value);
    return render(date, appendMeridian(date, "d MMM yyyy, h:mm"));
};

export const Duration: React.FunctionComponent<{ startDate: Date | null, endDate: Date | null }> = (props) => {
    const startDateLuxon = convertDateAndTime(props.startDate);
    const endDateLuxon = convertDateAndTime(props.endDate);

    if ((startDateLuxon && startDateLuxon.isValid) && (endDateLuxon && endDateLuxon.isValid)) {
        const startOfNextMonthAfterEnd = endDateLuxon.plus({months: 1}).startOf("month");
        const startOfStartMonth = startDateLuxon.startOf("month");
        const monthsFromYears = ((startOfNextMonthAfterEnd.year - startOfStartMonth.year) * 12);
        const remainingMonths = startOfNextMonthAfterEnd.month - startOfStartMonth.month;
        const months = monthsFromYears + remainingMonths;

        return <span>{`${months} ${months === 1 ? "month" : "months"}`}</span>;
    }

    return null;
};

export const Months: React.FunctionComponent<{months: number | null }> = (props) => {
    if (props.months || props.months === 0) {
        return <span>{`${props.months} ${props.months === 1 ? "month" : "months"}`}</span>;
    }
    return null;
};

export const ShortDateRangeFromDuration = (props: { startDate: Date|null, months: number|null}) => {
    const startDateLuxon = convertDateAndTime(props.startDate);
    const isValidDuration = (props.months) && Number.isInteger(props.months);
    const endDate = startDateLuxon && isValidDuration ? startDateLuxon.plus({months: props.months! - 1}).endOf("month").toJSDate() : null;
    return <ShortDateRange start={props.startDate} end={endDate}/>;
};

const appendMeridian = (date: DateTime|null, format: string) => {
    if(date && date.isValid) {
        return format + (date.hour > 12 ? "'pm'" : "'am'");
    }
    return format;
};
