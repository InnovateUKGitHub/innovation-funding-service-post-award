import React from "react";
import { ValidationMessage } from "../validationMessage";
import { AriaLive } from "./ariaLive";

interface Props {
  messages: string[];
}

export const Messages: React.FunctionComponent<Props> = (props) => (
  <AriaLive>
    {props.messages.map((x, i) => <ValidationMessage message={x} messageType="success" key={i} />)}
  </AriaLive>
);
