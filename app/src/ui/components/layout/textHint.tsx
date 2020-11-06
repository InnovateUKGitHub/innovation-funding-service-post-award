import React from "react";
import * as colour from "../../styles/colours";

export interface TextHintReactProps {
  children: string;
  style?: never;
  className?: never;
}

export function TextHint(props: TextHintReactProps) {
  if (!props.children.length) return null;

  return (
    <p {...props} data-qa="text-hint" className="govuk-body" style={{ color: colour.GOVUK_SECONDARY_TEXT_COLOUR }} />
  );
}
