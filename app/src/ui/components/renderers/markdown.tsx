import { marked } from "marked";

export interface IMarkdownProps {
  value: string;
  style?: React.CSSProperties;
}

/**
 * Renders a component that renders a string using markdown syntax
 */
export function Markdown({ value, ...props }: IMarkdownProps) {
  if (!value.length) return null;

  return <span {...props} className="govuk-body markdown" dangerouslySetInnerHTML={{ __html: marked.parse(value) }} />;
}
