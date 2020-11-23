import React from "react";
import cx from "classnames";
import { isContentSolution } from "@ui/hooks";
import { ContentSelector } from "@content/content";
import { Content } from "@ui/components/content";

import * as colours from "../styles/colours";

type MessageType = "info" | "error" | "success" | "warning" | "alert";

type ValidationInlineStyles = React.CSSProperties & {
  borderColor: string;
};

interface ValidationTypeUi {
  className: string;
  text: string;
  styles: ValidationInlineStyles;
}

const validationStyles: {
  [key in MessageType]: ValidationTypeUi;
} = {
  info: {
    className: "acc-message__info",
    text: "Info",
    styles: {
      borderColor: colours.GOVUK_COLOUR_BLUE,
    },
  },
  error: {
    className: "acc-message__error",
    text: "Error",
    styles: {
      borderColor: colours.GOVUK_ERROR_COLOUR,
    },
  },
  success: {
    className: "acc-message__success",
    text: "Success",
    styles: {
      borderColor: colours.GOVUK_COLOUR_GREEN,
      color: colours.GOVUK_COLOUR_GREEN,
    },
  },
  warning: {
    className: "acc-message__warning",
    text: "Warning",
    styles: {
      borderColor: colours.GOVUK_COLOUR_BLACK,
    },
  },
  alert: {
    className: "acc-message__alert",
    text: "Alert",
    styles: {
      borderColor: colours.GOVUK_ERROR_COLOUR,
      color: colours.GOVUK_ERROR_COLOUR,
    },
  },
};

export interface IValidationMessageProps {
  message: React.ReactChild | ContentSelector;
  messageType: MessageType;
  qa?: string;
}

export function ValidationMessage({ message, messageType, qa = "validation-message" }: IValidationMessageProps) {
  const isString = typeof message === "string";

  if (isString && !(message as string).length) return null;

  const ui = validationStyles[messageType];

  // TODO: Replace this with .includes
  const isBlockElement = ["string", "number", "function"].indexOf(typeof message) === -1;
  const ElementType = isBlockElement ? "div" : "span";

  return (
    <div
      className={cx("govuk-warning-text-background", "govuk-warning-text", "acc-message", ui.className)}
      data-qa={qa}
      data-qa-type={messageType}
      style={ui.styles}
    >
      <span data-qa={`${qa}-assistive`} className="govuk-warning-text__assistive">
        {ui.text}
      </span>

      <ElementType data-qa={`${qa}-content`}>
        {isContentSolution(message) ? <Content styles={ui.styles} value={message} /> : message}
      </ElementType>
    </div>
  );
}
