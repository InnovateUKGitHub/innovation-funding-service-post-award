import * as colour from "../../styles/colours";
import { SimpleString } from "../renderers";

export interface TextHintReactProps {
  children: string;
  style?: never;
  className?: never;
}

const textHintStyles = { color: colour.govukSecondaryTextColour };

/**
 * TextHint component
 */
export function TextHint(props: TextHintReactProps) {
  if (!props.children.length) return null;

  return <SimpleString {...props} style={textHintStyles} />;
}
