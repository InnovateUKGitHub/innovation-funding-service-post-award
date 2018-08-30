import * as React from "react";

export const Email: React.SFC<{ value: string }> = (props) => {
    return (
        <a href={`mailto:${props.value}`} className="govuk-link govuk-!-font-size-19">{props.value}</a>
    );
};
