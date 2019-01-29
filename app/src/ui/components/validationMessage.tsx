import React from "react";
import classnames from "classnames";
import * as colour from "../styles/colours";

type MessageType = "info" | "error" | "success";

interface Props {
    message: string;
    messageType: MessageType;
    qa?: string;
}

interface MessageStyle {
  validationColour: string;
  validationSymbol: string;
  validationText: string;
}

const getMessageStyle = (messageType: MessageType): MessageStyle => {
  switch (messageType) {
    case "info": return {
      validationColour: colour.GOVUK_COLOUR_BLUE,
      validationSymbol: "/assets/images/icon-info.png",
      validationText: "Info",
    };
    case "error": return {
      validationColour: colour.GOVUK_ERROR_COLOUR,
      validationSymbol: "/assets/images/icon-alert.png",
      validationText: "Error",
    };
    case "success": return {
      validationColour: colour.GOVUK_COLOUR_GREEN,
      validationSymbol: "/assets/images/icon-tick.png",
      validationText: "Success",
    };
  }
};

export const ValidationMessage: React.SFC<Props> = ({ message, messageType, qa = "validation-message" }) => {
    if (!message) return null;

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
      display: "inline-flex",
      alignItems: "center"
    };

    const classes = classnames("govuk-warning-text__text", { "govuk-!-font-weight-bold": messageType !== "info" });
    const fontStyle = { color: messageType === "success" ? colour.GOVUK_COLOUR_GREEN : undefined };

    return (
        <div className="govuk-warning-text-background" style={backgroundStyle} data-qa={qa} data-qa-type={messageType}>
            <div className="govuk-warning-text" style={textStyle}>
              <img src={validationSymbol} />
              <p className={classes} style={fontStyle}>
                <span className="govuk-warning-text__assistive">{validationText}</span>
                <span>{message}</span>
              </p>
            </div>
        </div>
    );
};
