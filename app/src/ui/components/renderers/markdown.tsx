import Marked from "marked";

export interface IMarkdownProps {
  value: string;
  style?: React.CSSProperties;
}

export function Markdown({ value, ...props }: IMarkdownProps) {
  if (!value.length) return null;

  const dangerousHTML = Marked(value);

  return <span {...props} className="govuk-body markdown" dangerouslySetInnerHTML={{ __html: dangerousHTML }} />;
}
