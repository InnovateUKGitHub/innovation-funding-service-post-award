import { govukSecondaryTextColour } from "@ui/styles/colours";
import { SimpleString } from "../../atoms/SimpleString/simpleString";

export interface TextHintReactProps {
  children: string;
  style?: never;
  className?: never;
}

const textHintStyles = { color: govukSecondaryTextColour };

/**
 * TextHint component
 */
export function TextHint(props: TextHintReactProps) {
  if (!props.children.length) return null;

  return <SimpleString {...props} style={textHintStyles} />;
}
