import React from "react";
import {ClaimDto} from "../../types";
import * as ACC from "./index";

interface Props {
    message: string;
    document: DocumentSummaryDto;
    openNewWindow?: boolean;
    qa?: string;
    onClick: () => void;
}

export const DocumentSingle: React.SFC<Props> = ({ message, document, openNewWindow, qa, onClick }: Props) => {

    const textStyle = {
        paddingRight: "20px"
    };
    const Form = ACC.TypedForm<ClaimDto>();
    return (
        <div>
            <div className="govuk-!-padding-bottom-3">
                <p className="govuk-body">{message}</p>
            </div>
            <div className="govuk-!-padding-bottom-3">
                <a target={openNewWindow ? "_blank" : ""} href={document.link} style={textStyle} className="govuk-link govuk-!-font-size-19" data-qa={qa}>{document.fileName}</a>
                <span className="govuk-body"> (opens in a new window)</span>
            </div>
            <Form.Button name="return" onClick={onClick} >Remove</Form.Button>
        </div>
    );
};
