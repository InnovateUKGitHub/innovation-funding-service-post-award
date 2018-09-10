import React from "react";

interface Props {
    value: number | null;
}

export const Currency: React.SFC<Props> = (props) => {
    if (props.value || props.value === 0) {
        const valToRender = props.value.toFixed(2);
        return <span>£ {valToRender}</span>;
    }
    return null;
};
