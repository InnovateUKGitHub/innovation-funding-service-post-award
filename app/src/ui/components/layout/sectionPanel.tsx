import * as React from "react";
import * as colour from "../../styles/colours";

interface Props {
    title?: React.ReactNode;
    qa?: string;
}

export const SectionPanel: React.FunctionComponent<Props> = (props) => {
    const { qa, title, children } = props;
    const style = {
        border: `1px solid ${colour.GOVUK_BORDER_COLOUR}`
    };
    return (
        <div className="govuk-!-padding-3" data-qa={qa} style={style} >
            {title ? <h2 className="govuk-heading-m govuk-!-margin-bottom-6">{title}</h2> : null}
            {children}
        </div>
    );
};
