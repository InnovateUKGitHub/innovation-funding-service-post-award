import * as React from "react";

export const Email: React.SFC<{ value: string }> = (props) => {
    if (props.value) {
        return (
            <a href={`mailto:${props.value}`} className="govuk-link govuk-!-font-size-19">{props.value}</a>
        );
    }
    return null;
};
