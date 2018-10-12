import React from "react";
import { Result } from "../validation/result";

interface Props {
    message: Result;
    key?: string;
}

export const ValidationMessage: React.SFC<Props> = ({ message, key }) => {
    if (!message || !message.showValidationErrors || message.isValid) {
        return null;
    }

    const warningColour = "#b10e1e";

    const backgroundStyle = {
        padding: "2% 4% 2% 1%",
        background: "rgb(248, 248, 248, 1)",
        borderLeft: `5px solid ${warningColour}`,
    };

    const textStyle = {
        margin: 0,
    };

    const iconStyle = {
        background: warningColour,
        border: warningColour,
    };

    return (
        <div className="govuk-warning-text-background" style={backgroundStyle}>
            <div className="govuk-warning-text" key={key} style={textStyle}>
                <span className="govuk-warning-text__icon" aria-hidden="true" style={iconStyle} >!</span>
                <strong className="govuk-warning-text__text">
                    <span className="govuk-warning-text__assistive">Warning</span> {message.errorMessage}
                </strong>
            </div>
        </div>
    );
};
