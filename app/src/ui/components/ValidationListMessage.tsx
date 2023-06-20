import { UL } from "./layout/list";
import { SimpleString } from "./renderers/simpleString";
import { ValidationMessage } from "./validationMessage";

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
