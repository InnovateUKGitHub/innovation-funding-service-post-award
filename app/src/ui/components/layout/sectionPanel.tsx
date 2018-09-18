import * as React from "react";

interface Props {
    title?: React.ReactNode;
    qa?: string;
}

export const SectionPanel: React.SFC<Props> = (props) => {
    const { qa, title, children } = props;
    const style = {
        border: "1px solid #bfc1c3"
    };
    return (
        <div className="govuk-!-padding-3" data-qa={qa} style={style} >
            {title ? <h2 className="govuk-heading-m govuk-!-margin-bottom-6">{title}</h2> : null}
            {children}
        </div>
    );
};
