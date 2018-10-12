import React from "react";

export const InsetText: React.SFC<{ text: string|null}> = ({ text }) => {
    if(!text) {
        return null;
    }
    return (<div className="govuk-inset-text">{text}</div>);
};
