import { ValidationMessage } from "../validation/ValidationMessage/ValidationMessage";
import { AriaLive } from "../../atoms/AriaLive/ariaLive";

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
