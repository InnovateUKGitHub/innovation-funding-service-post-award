import * as React from "react";

interface Props {
    title?: React.ReactNode;
    qa?: string;
}

export const Section: React.SFC<Props> = (props) => {
    return (
        <div className="govuk-!-margin-bottom-9" data-qa={props.qa}>
            {props.title ? <h2 className="govuk-heading-m govuk-!-margin-bottom-9">{props.title}</h2> : null}
            {props.children}
        </div>
    );
};
