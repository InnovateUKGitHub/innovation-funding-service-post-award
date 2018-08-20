import * as React from 'react';

//Todo replace
const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const FullDate: React.SFC<{ value: Date | string }> = (props) => {
    let dateValue: Date | null = null;

    if (!!props.value && typeof (props.value) === "string") {
        dateValue = new Date(props.value);
    }
    else if (!!props.value && props.value instanceof Date) {
        dateValue = props.value
    }

    if (dateValue) {
        return <span>{`${dateValue.getDate()} ${months[dateValue.getMonth()]} ${dateValue.getFullYear()}`}</span>;
    }
    return null;
}