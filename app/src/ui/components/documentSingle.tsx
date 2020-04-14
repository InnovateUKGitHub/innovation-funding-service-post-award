import React from "react";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

interface Props {
    message?: string;
    document: DocumentSummaryDto;
    openNewWindow?: boolean;
    qa?: string;
    renderRemove?: () => React.ReactNode;
}

const Message: React.FunctionComponent<{message?: string}> = ({message}: {message?: string}) => {
    if (!message) {
        return null;
    }
    return (
      <div className="govuk-!-padding-bottom-3">
        <p className="govuk-body">{message}</p>
      </div>
    );
};

export const DocumentSingle: React.FunctionComponent<Props> = ({ message, document, openNewWindow, qa, renderRemove }: Props) => {

    const textStyle = {
        paddingRight: "20px"
    };
    return (
        <div>
            <Message message={message}/>
            <div className="govuk-!-padding-bottom-3">
                <a target={openNewWindow ? "_blank" : ""} href={document.link} style={textStyle} className="govuk-link govuk-!-font-size-19" data-qa={qa}>{document.fileName}</a>
                <span className="govuk-body"> (opens in a new window)</span>
            </div>
            {renderRemove && renderRemove()}
        </div>
    );
};
