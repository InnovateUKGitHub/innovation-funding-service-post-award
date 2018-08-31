import * as React from "react";
import { DateTime } from "luxon";

const renderDate = (value: Date | null, format: string) => {
    const dateValue = value && DateTime.fromJSDate(value);
    if (dateValue && dateValue.isValid) {
        return <span>{dateValue.toFormat(format)}</span>;
    }
    return null;
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
