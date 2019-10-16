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

export const CondensedDateRange: React.SFC<{ start: Date | null, end: Date | null }> = props => {
    return renderDateRange(convertDateOnly(props.start), convertDateOnly(props.end), "MMM", true);
};

export const LongDateRange: React.SFC<{ start: Date | null, end: Date | null }> = props => {
    return renderDateRange(convertDateOnly(props.start), convertDateOnly(props.end), "d MMMM");
};

export const ShortDateRange: React.SFC<{ start: Date | null, end: Date | null }> = props => {
    return renderDateRange(convertDateOnly(props.start), convertDateOnly(props.end), "d MMM");
};

export const ShortMonth: React.SFC<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "MMM");
};

export const DayAndLongMonth: React.SFC<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "d MMMM");
};

export const LongYear: React.SFC<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "yyyy");
};

export const FullDate: React.SFC<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "d MMMM yyyy");
};

export const FullDateTime: React.SFC<{ value: Date | null }> = (props) => {
    const date = convertDateAndTime(props.value);
    return render(date, appendMeridian(date, "d MMMM yyyy, h:mm"));
};

export const ShortDate: React.SFC<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "d MMM yyyy");
};

export const ShortDateTime: React.SFC<{ value: Date | null }> = (props) => {
    const date = convertDateAndTime(props.value);
    return render(date, appendMeridian(date, "d MMM yyyy, h:mm"));
};

export const Duration: React.FunctionComponent<{ startDate: Date | null, endDate: Date | null }> = (props) => {
    const startDateLuxon = convertDateAndTime(props.startDate);
    const endDateLuxon = convertDateAndTime(props.endDate);

    if ((startDateLuxon && startDateLuxon.isValid) && (endDateLuxon && endDateLuxon.isValid)) {
        const duration = endDateLuxon.diff(startDateLuxon).as("months");
        const months = Math.round(duration);

        return <span>{`${months} ${months === 1 ? "month" : "months"}`}</span>;
    }
    return null;
};

const appendMeridian = (date: DateTime|null, format: string) => {
    if(date && date.isValid) {
        return format + (date.hour > 12 ? "'pm'" : "'am'");
    }
    return format;
};
