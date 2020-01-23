import React from "react";

export const InsetText: React.FunctionComponent<{ text: string|null}> = ({ text }) => {
    if(!text) {
        return null;
    }
    return (<div className="govuk-inset-text">{text}</div>);
};
