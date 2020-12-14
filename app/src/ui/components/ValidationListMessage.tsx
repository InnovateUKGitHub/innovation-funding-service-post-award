import React from "react";
import { SimpleString } from "./renderers";
import { ValidationMessage } from "./validationMessage";

export interface ValidationListMessageProps<MessageContent = JSX.Element | string> {
  before: MessageContent;
  after?: MessageContent;
  items?: string[];
}

export function ValidationListMessage({ before, items = [], after, ...props }: ValidationListMessageProps) {
  if (!items.length) return null;

  const markup = (
    <>
      <SimpleString>{before}</SimpleString>

      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {after && <SimpleString>{after}</SimpleString>}
    </>
  );

  return <ValidationMessage {...props} messageType="info" message={markup} />;
}
