import React from "react";

interface Props {
    value: number | null;
}

export const Percentage: React.SFC<Props> = (props) => {
    if (props.value || props.value === 0) {
        const valToRender = props.value.toFixed(0);
        return <span>{valToRender}%</span>;
    }
    return null;
};
