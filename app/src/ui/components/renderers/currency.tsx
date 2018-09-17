import React from "react";
import { isNumber } from "../../../util/NumberHelper";

interface Props {
    value: number | null;
    fractionDigits?: number;
}

// TODO format currency with comma separator and minus in right place -£2,100 vs £-2100
export const Currency: React.SFC<Props> = ({ value, fractionDigits = 0 }) => {
    if (isNumber(value)) {
        const valToRender = value.toFixed(fractionDigits);
        return <span>£&nbsp;{valToRender}</span>;
    }
    return null;
};
