import * as React from "react";
import { DateTime } from "luxon";

const convertDateAndTime = (jsDate: Date | null): DateTime | null => {
    return jsDate && DateTime.fromJSDate(jsDate);
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

export const DateRange: React.SFC<{ start: Date | null, end: Date | null }> = props => {
    const start = convertDateOnly(props.start);
    const end = convertDateOnly(props.end);

    if (!start || !start.isValid || !end || !end.isValid) {
        return null;
    }

    if (start.month === end.month && start.year === end.year) {
        return <span style={{ whiteSpace: "nowrap" }}>{end.monthShort} {end.year}</span>;
    }

    if (start.year === end.year) {
        return (
            <span>
                <span style={{ whiteSpace: "nowrap" }}>{start.monthShort} to </span>
                <span style={{ whiteSpace: "nowrap" }}>{end.monthShort} {end.year}</span>
            </span>
        );
    }

    return (
        <span>
            <span style={{ whiteSpace: "nowrap" }}>{start.monthShort} {start.year} to </span>
            <span style={{ whiteSpace: "nowrap" }}>{end.monthShort} {end.year}</span>
        </span>
    );
};

export const LongDateRange: React.SFC<{ start: Date | null, end: Date | null, isShortMonth?: boolean }> = props => {
    const start = convertDateOnly(props.start);
    const end = convertDateOnly(props.end);
    const isShortMonth = props.isShortMonth;

    if (!start || !start.isValid || !end || !end.isValid) {
        return null;
    }

    if (start.year === end.year) {
        return (
            <span>
                <span style={{ whiteSpace: "nowrap" }}>{start.day} {isShortMonth ? start.monthShort : start.monthLong} to </span>
                <span style={{ whiteSpace: "nowrap" }}>{end.day} {isShortMonth ? end.monthShort : end.monthLong} {end.year}</span>
            </span>
        );
    }

    return (
        <span>
            <span style={{ whiteSpace: "nowrap" }}>{start.day} {isShortMonth ? start.monthShort : start.monthLong} {start.year} to </span>
            <span style={{ whiteSpace: "nowrap" }}>{end.day} {isShortMonth ? end.monthShort : end.monthLong} {end.year}</span>
        </span>
    );
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
    return render(convertDateAndTime(props.value), "d MMMM yyyy, hh:mm a");
};

export const ShortDate: React.SFC<{ value: Date | null }> = (props) => {
    return render(convertDateOnly(props.value), "d MMM yyyy");
};

export const ShortDateTime: React.SFC<{ value: Date | null }> = (props) => {
    return render(convertDateAndTime(props.value), "d MMM yyyy, hh:mm a");
};
