import React from "react";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { useContent } from "@ui/redux/contentProvider";

export interface DocumentSingleProps {
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

export const DocumentSingle: React.FunctionComponent<DocumentSingleProps> = ({ message, document, openNewWindow, qa, renderRemove }: DocumentSingleProps) => {

    const textStyle = {
        paddingRight: "20px"
    };
    const { getContent } = useContent();
    const newWindowText = getContent((x) => x.components.documentSingle.newWindow);
    const newWindowMessage = ` (${newWindowText})`;

    return (
        <div>
            <Message message={message}/>
            <div className="govuk-!-padding-bottom-3">
                <a target={openNewWindow ? "_blank" : ""} href={document.link} style={textStyle} className="govuk-link govuk-!-font-size-19" data-qa={qa}>{document.fileName}</a>
                <span className="govuk-body">{newWindowMessage}</span>
            </div>
            {renderRemove && renderRemove()}
        </div>
    );
};
