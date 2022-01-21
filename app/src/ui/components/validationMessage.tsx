import cx from "classnames";
import { isContentSolution } from "@ui/hooks";
import { ContentSelector } from "@content/content";
import { Content } from "@ui/components/content";

import * as colours from "../styles/colours";
import { SimpleString } from "./renderers";

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
      borderColor: colours.govukColourBlue,
    },
  },
  error: {
    className: "acc-message__error",
    text: "Error",
    styles: {
      borderColor: colours.govukErrorColour,
    },
  },
  success: {
    className: "acc-message__success",
    text: "Success",
    styles: {
      borderColor: colours.govukColourGreen,
      color: colours.govukColourGreen,
    },
  },
  warning: {
    className: "acc-message__warning",
    text: "Warning",
    styles: {
      borderColor: colours.govukColourBlack,
    },
  },
  alert: {
    className: "acc-message__alert",
    text: "Alert",
    styles: {
      borderColor: colours.govukErrorColour,
      color: colours.govukErrorColour,
    },
  },
};

export interface IValidationMessageProps {
  message: React.ReactChild | ContentSelector;
  messageType: MessageType;
  qa?: string;
}

export function ValidationMessage({ message, messageType, qa = "validation-message" }: IValidationMessageProps) {
  if (typeof message === "string" && !message.length) return null;

  const isBlockElement = !["string", "number", "function"].includes(typeof message);
  const elementType = isBlockElement ? "div" : "span";

  const ui = validationStyles[messageType];

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

      <SimpleString as={elementType} qa={`${qa}-content`} style={{ color: ui.styles.color }}>
        {isContentSolution(message) ? <Content styles={ui.styles} value={message} /> : message}
      </SimpleString>
    </div>
  );
}
