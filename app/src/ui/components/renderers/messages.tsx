import React from "react";
import { ValidationMessage } from "../validationMessage";

interface Props {
  messages: string[];
}

export const Messages: React.SFC<Props> = (props) => (
  <React.Fragment>
    {props.messages.map((x, i) => <ValidationMessage message={x} messageType="success" key={i} />)}
  </React.Fragment>
);
