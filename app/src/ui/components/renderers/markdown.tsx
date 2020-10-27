import React from "react";
import Marked from "marked";

export interface IMarkdownProps {
  value: string;
  style?: React.CSSProperties;
}

export function Markdown({ value, ...props }: IMarkdownProps) {
  if (!value.length) return null;

  const dangerousHTML = Marked(value);

  return (
    <span
      {...props}
      data-qa="markdown"
      className="govuk-body markdown"
      dangerouslySetInnerHTML={{ __html: dangerousHTML }}
    />
  );
}
