import React from "react";
import { Result } from "../validators/common";

interface Props {
    message: Result;
    key?: string;
}

export const ValidationMessage: React.SFC<Props> = ({ message, key }) => {
    if (!message || !message.showValidationErrors() || message.isValid()) {
        return null;
    }

    return (
        <div className="govuk-warning-text" key={key}>
            <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
            <strong className="govuk-warning-text__text">
                <span className="govuk-warning-text__assistive">Warning</span> {message.errorMessage}
            </strong>
        </div>
    );
};
