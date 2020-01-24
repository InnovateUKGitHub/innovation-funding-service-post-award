import * as React from "react";

export const Email: React.FunctionComponent<{ value: string|null, qa?: string }> = (props) => {
    if (props.value) {
        return (
            <a href={`mailto:${props.value}`} className="govuk-link govuk-!-font-size-19" data-qa={props.qa}>{props.value}</a>
        );
    }
    return null;
};
