import React from "react";

export const Json: React.FunctionComponent<{value: any}> = (props) => {
    return <pre>{JSON.stringify(props.value, null, 5)}</pre>;
};
