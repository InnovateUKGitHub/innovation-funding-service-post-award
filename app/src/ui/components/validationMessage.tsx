import React from "react";
import classnames from "classnames";
import * as colours from "../styles/colours";
import { ContentSelector } from "@content/content";
import { Content } from "@ui/components/content";

type MessageType = "info" | "error" | "success" | "warning" | "alert";

interface IValidationMessageProps {
    message?: React.ReactNode;
    messageContent?: ContentSelector;
    messageType: MessageType;
    qa?: string;
}

export interface MessageStyle {
  color?: string;
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
      color: colours.GOVUK_COLOUR_GREEN,
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
      color: colours.GOVUK_ERROR_COLOUR,
    };
  }
};

export const ValidationMessage = ({ message, messageContent, messageType, qa = "validation-message" }: IValidationMessageProps) => {
    if (!message && !messageContent) return null;

    const contentStyle = getMessageStyle(messageType);
    const {color, validationColour, validationClass, validationText} = contentStyle;
    const msgClasses = classnames("govuk-warning-text-background", "govuk-warning-text", "acc-message", validationClass);
    const style = {
      borderColor: validationColour,
      color
    };

    return (
      <div className={msgClasses} style={style} data-qa={qa} data-qa-type={messageType}>
        <span className="govuk-warning-text__assistive">{validationText}</span>
        <span>{messageContent ? <Content styles={contentStyle} value={messageContent}/> : message}</span>
      </div>
    );
};
