import * as React from "react";

const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getValueAsDate = (value: Date | string) => {
    let dateValue: Date | null = null;

    if (!!value && typeof (value) === "string") {
        dateValue = new Date(value);
    }
    else if (!!value && value instanceof Date) {
        dateValue = value;
    }

    return dateValue;
};

export const FullDate: React.SFC<{ value: Date | string }> = (props) => {
    const dateValue = getValueAsDate(props.value);

    if (dateValue && !isNaN(dateValue.getDate())) {
        return <span>{`${dateValue.getDate()} ${months[dateValue.getMonth()]} ${dateValue.getFullYear()}`}</span>;
    }
    return null;
};

export const FullDateTime: React.SFC<{ value: Date | string }> = (props) => {
    const dateValue = getValueAsDate(props.value);

    if (dateValue && !isNaN(dateValue.getDate())) {
        return <span>{`${dateValue.getDate()} ${months[dateValue.getMonth()]} ${dateValue.getFullYear().toString()} ${dateValue.getHours()}:${dateValue.getMinutes()}`}</span>;
    }
    return null;
};

export const FullDateTimeWithSeconds: React.SFC<{ value: Date | string }> = (props) => {
    const dateValue = getValueAsDate(props.value);

    if (dateValue && !isNaN(dateValue.getDate())) {
        return <span>{`${dateValue.getDate()} ${months[dateValue.getMonth()]} ${dateValue.getFullYear().toString()} ${dateValue.getHours()}:${dateValue.getMinutes()}:${dateValue.getSeconds()}`}</span>;
    }
    return null;
};

export const ShortDate: React.SFC<{ value: Date | string }> = (props) => {
    const dateValue = getValueAsDate(props.value);

    if (dateValue && !isNaN(dateValue.getDate())) {
        return <span>{`${dateValue.getDate()}/${dateValue.getMonth() + 1}/${dateValue.getFullYear().toString()}`}</span>;
    }
    return null;
};

export const ShortDateTime: React.SFC<{ value: Date | string }> = (props) => {
    const dateValue = getValueAsDate(props.value);

    if (dateValue && !isNaN(dateValue.getDate())) {
        return <span>{`${dateValue.getDate()}/${dateValue.getMonth() + 1}/${dateValue.getFullYear().toString()} ${dateValue.getHours()}:${dateValue.getMinutes()}`}</span>;
    }
    return null;
};
