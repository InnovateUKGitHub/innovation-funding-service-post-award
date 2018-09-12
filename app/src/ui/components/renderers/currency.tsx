import React from "react";

interface Props {
    value: number | null;
    fractionDigits?: number;
}

export const Currency: React.SFC<Props> = ({ value, fractionDigits = 0 }) => {
    if (value || value === 0) {
        const valToRender = value.toFixed(fractionDigits);
        return <span>£ {valToRender}</span>;
    }
    return null;
};
