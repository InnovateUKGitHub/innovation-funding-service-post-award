import React from "react";
import * as colour from "../styles/colours";

interface Props {
    message: string;
    key?: string;
    messageType: "info" | "error";
}

interface MessageStyle {
  validationColour: string;
  validationSymbol: string;
  validationText: string;
}

const getMessageStyle = (messageType: string): MessageStyle => {
  switch (messageType) {
    case "info": return {
      validationColour: colour.GOVUK_COLOUR_BLUE,
      validationSymbol: "i",
      validationText: "Info",
    };
    case "error": return {
      validationColour: colour.GOVUK_ERROR_COLOUR,
      validationSymbol: "!",
      validationText: "Error",
    };
    default: throw Error("MessageType not supported");
  }
};

export const ValidationMessage: React.SFC<Props> = ({ message, key, messageType }) => {
    if (!message) {
        return null;
    }

    const {validationColour, validationSymbol, validationText} = getMessageStyle(messageType);

    const backgroundStyle = {
      padding: "2% 4% 2% 1%",
      background: colour.GOVUK_COLOUR_GREY_4,
      borderLeft: `5px solid ${validationColour}`,
      marginTop: "30px",
      marginBottom: "30px",
    };

    const textStyle = {
      margin: 0,
    };

    const iconStyle = {
      background: validationColour,
      border: validationColour,
    };

    return (
        <div className="govuk-warning-text-background" style={backgroundStyle}>
            <div className="govuk-warning-text" key={key} style={textStyle}>
                <span className="govuk-warning-text__icon" aria-hidden="true" style={iconStyle} >{validationSymbol}</span>
                <strong className="govuk-warning-text__text">
                  <span className="govuk-warning-text__assistive">{validationText}</span>{message}
                </strong>
            </div>
        </div>
    );
};
