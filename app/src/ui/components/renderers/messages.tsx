import React from "react";
import { ValidationMessage } from "../validationMessage";
import { AriaLive } from "./ariaLive";

export interface IMessagesProps {
  messages: string[];
}

export const Messages = ({ messages }: IMessagesProps) => (
  <AriaLive>
    {messages.map((x, i) => (
      <ValidationMessage message={x} messageType="success" key={i} />
    ))}
  </AriaLive>
);
