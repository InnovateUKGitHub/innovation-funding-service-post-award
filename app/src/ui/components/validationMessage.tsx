import React from "react";
import classnames from "classnames";
import * as colours from "../styles/colours";
import { ContentSelector } from "@content/content";
import { Content } from "@ui/components/content";

type MessageType = "info" | "error" | "success" | "warning" | "alert";

interface Props {
    message?: React.ReactNode;
    messageContent?: ContentSelector;
    messageType: MessageType;
    qa?: string;
}

interface MessageStyle {
  colour?: string;
  validationColour: string;
  validationClass: string;
  validationText: string;
}

const getMessageStyle = (messageType: MessageType): MessageStyle => {
  switch (messageType) {
    case "info": return {
      validationColour: colours.GOVUK_COLOUR_BLUE,
      validationClass: "acc-message__info",
      validationText: "Info",
    };
    case "error": return {
      validationColour: colours.GOVUK_ERROR_COLOUR,
      validationClass: "acc-message__error",
      validationText: "Error",
    };
    case "success": return {
      validationColour: colours.GOVUK_COLOUR_GREEN,
      validationClass: "acc-message__success",
      validationText: "Success",
      colour: colours.GOVUK_COLOUR_GREEN,
    };
    case "warning": return {
      validationColour: colours.GOVUK_COLOUR_BLACK,
      validationClass: "acc-message__warning",
      validationText: "Warning",
    };
    case "alert": return {
      validationColour: colours.GOVUK_ERROR_COLOUR,
      validationClass: "acc-message__alert",
      validationText: "Alert",
      colour: colours.GOVUK_ERROR_COLOUR,
    };
  }
};

export const ValidationMessage: React.FunctionComponent<Props> = ({ message, messageContent, messageType, qa = "validation-message" }) => {
    if (!message && !messageContent) return null;

    const {colour, validationColour, validationClass, validationText} = getMessageStyle(messageType);
    const msgClasses = classnames("govuk-warning-text-background", "govuk-warning-text", "acc-message", validationClass);
    const style = {
      borderColor: validationColour,
      color:colour
    };

    return (
      <div className={msgClasses} style={style} data-qa={qa} data-qa-type={messageType}>
        <span className="govuk-warning-text__assistive">{validationText}</span>
        <span>{messageContent ? <Content value={messageContent}/> : message}</span>
      </div>
    );
};
