import React from "react";

interface Props {
    message: string;
    document: DocumentSummaryDto;
    openNewWindow?: boolean;
    qa?: string;
    renderRemove?: () => React.ReactNode;
}

export const DocumentSingle: React.SFC<Props> = ({ message, document, openNewWindow, qa, renderRemove }: Props) => {

    const textStyle = {
        paddingRight: "20px"
    };
    return (
        <div>
            <div className="govuk-!-padding-bottom-3">
                <p className="govuk-body">{message}</p>
            </div>
            <div className="govuk-!-padding-bottom-3">
                <a target={openNewWindow ? "_blank" : ""} href={document.link} style={textStyle} className="govuk-link govuk-!-font-size-19" data-qa={qa}>{document.fileName}</a>
                <span className="govuk-body"> (opens in a new window)</span>
            </div>
            {renderRemove && renderRemove()}
        </div>
    );
};
