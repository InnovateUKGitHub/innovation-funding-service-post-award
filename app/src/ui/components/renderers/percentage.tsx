import React from "react";
import {isNumber} from "../../../util/NumberHelper";

interface Props {
    value: number | null;
}

export const Percentage: React.SFC<Props> = (props) => {
    if (isNumber(props.value)) {
        const valToRender = props.value.toFixed(0);
        return <span>{valToRender}&nbsp;%</span>;
    }
    return null;
};
