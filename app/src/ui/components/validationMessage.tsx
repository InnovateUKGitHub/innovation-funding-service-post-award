import React from "react";
import classnames from "classnames";
import * as colour from "../styles/colours";

type MessageType = "info" | "error" | "success" | "warning";

interface Props {
    message: React.ReactNode;
    messageType: MessageType;
    qa?: string;
}

interface MessageStyle {
  validationColour: string;
  validationClass: string;
  validationText: string;
}

const getMessageStyle = (messageType: MessageType): MessageStyle => {
  switch (messageType) {
    case "info": return {
      validationColour: colour.GOVUK_COLOUR_BLUE,
      validationClass: "acc-message__info",
      validationText: "Info",
    };
    case "error": return {
      validationColour: colour.GOVUK_ERROR_COLOUR,
      validationClass: "acc-message__error",
      validationText: "Error",
    };
    case "success": return {
      validationColour: colour.GOVUK_COLOUR_GREEN,
      validationClass: "acc-message__success",
      validationText: "Success",
    };
    case "warning": return {
      validationColour: colour.GOVUK_COLOUR_BLACK,
      validationClass: "acc-message__warning",
      validationText: "Warning",
    };
  }
};

export const ValidationMessage: React.SFC<Props> = ({ message, messageType, qa = "validation-message" }) => {
    if (!message) return null;

    const {validationColour, validationClass, validationText} = getMessageStyle(messageType);

    const backgroundStyle = { borderColor: validationColour };
    const textStyle = messageType === "success" ? { color: colour.GOVUK_COLOUR_GREEN } : undefined;
    const msgClasses = classnames("govuk-warning-text-background", "acc-message", validationClass);
    const textClasses = classnames("govuk-warning-text", { "govuk-!-font-weight-bold": messageType === "error" });

    return (
      <div className={msgClasses} style={backgroundStyle} data-qa={qa} data-qa-type={messageType}>
        <div className={textClasses} style={textStyle}>
          <span className="govuk-warning-text__assistive">{validationText}</span>
          <span>{message}</span>
        </div>
      </div>
    );
};
