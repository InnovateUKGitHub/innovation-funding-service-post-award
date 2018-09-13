import React from "react";
import { isNumber } from "../../../util/NumberHelper";

interface Props {
    value: number | null;
    fractionDigits?: number;
}

export const Currency: React.SFC<Props> = ({ value, fractionDigits = 0 }) => {
    if (isNumber(value)) {
        const valToRender = value.toFixed(fractionDigits);
        return <span>£ {valToRender}</span>;
    }
    return null;
};
