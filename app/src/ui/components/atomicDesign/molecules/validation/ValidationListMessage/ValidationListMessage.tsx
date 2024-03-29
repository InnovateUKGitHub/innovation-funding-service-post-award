import { UL } from "../../../atoms/List/list";
import { SimpleString } from "../../../atoms/SimpleString/simpleString";
import { ValidationMessage } from "../ValidationMessage/ValidationMessage";

export interface ValidationListMessageProps<MessageContent = JSX.Element | string> {
  before: MessageContent;
  after?: MessageContent;
  items?: string[];
}

export const ValidationListMessage = ({ before, items = [], after, ...props }: ValidationListMessageProps) => {
  if (!items.length) return null;

  const messages = items.map(item => <li key={item}>{item}</li>);

  const markup = (
    <>
      <SimpleString>{before}</SimpleString>
      <UL>{messages}</UL>
      {after && <SimpleString>{after}</SimpleString>}
    </>
  );

  return <ValidationMessage {...props} messageType="info" message={markup} />;
};
