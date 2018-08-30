import * as React from "react";
import { DateTime } from "luxon";

const getValueAsDateTime = (value: Date | string) => {
    let dateValue: DateTime | null = null;

    if (!!value && typeof (value) === "string") {
        dateValue = DateTime.fromISO(value);
    }
    else if (!!value && value instanceof Date) {
        dateValue = DateTime.fromJSDate(value);
    }

    return dateValue;
};

const renderDate = (value: Date | string, format:string) => {
    const dateValue = getValueAsDateTime(value);
    if (dateValue && dateValue.isValid) {
        return <span>{dateValue.toFormat(format)}</span>;
    }
    return null;
}

export const FullDate: React.SFC<{ value: Date | string }> = (props) => {
    return renderDate(props.value, "d MMM yyyy");
};

export const FullDateTime: React.SFC<{ value: Date | string }> = (props) => {
    return renderDate(props.value, "d MMM yyyy HH:mm");
};

export const FullDateTimeWithSeconds: React.SFC<{ value: Date | string }> = (props) => {
    return renderDate(props.value, "d MMM yyyy HH:mm:ss");
};

export const ShortDate: React.SFC<{ value: Date | string }> = (props) => {
    return renderDate(props.value, "dd/MM/yyyy");
};

export const ShortDateTime: React.SFC<{ value: Date | string }> = (props) => {
    return renderDate(props.value, "dd/MM/yyyy HH:mm");
};
