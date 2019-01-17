import * as React from "react";
import { DateTime } from "luxon";

const renderDate = (value: Date | null, format: string) => {
    const dateValue = value && DateTime.fromJSDate(value);

    if (dateValue && dateValue.isValid) {
        return <span>{dateValue.toFormat(format)}</span>;
    }

    return null;
};

export const DateRange: React.SFC<{ start: Date | null, end: Date | null }> = props => {
    const start = props.start && DateTime.fromJSDate(props.start);
    const end = props.end && DateTime.fromJSDate(props.end);

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

export const LongDateRange: React.SFC<{ start: Date | null, end: Date | null , isShortMonth?: boolean}> = props => {
    const start = props.start && DateTime.fromJSDate(props.start);
    const end = props.end && DateTime.fromJSDate(props.end);
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
    return renderDate(props.value, "MMM");
};

export const DayAndLongMonth: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMMM");
};

export const LongYear: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "yyyy");
};

export const FullDate: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMMM yyyy");
};

export const FullDateTime: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMMM yyyy HH:mm");
};

export const FullDateTimeWithSeconds: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMMM yyyy HH:mm:ss");
};

export const ShortDate: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMM yyyy");
};

export const ShortDateTime: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMM yyyy HH:mm");
};
