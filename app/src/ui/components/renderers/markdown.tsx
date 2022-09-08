import { marked } from "marked";

export interface IMarkdownProps {
  value: string;
  style?: React.CSSProperties;
}

/**
 * Renders a component that renders a string using markdown syntax.
 *
 * Warning! it is possible that this will produce differences in the rendering
 * between server side and client side. Especially if wrapped in other components
 * and parents. E.g. if `<Content>` wrapped in `<SimpleString>`
 */
export function Markdown({ value, ...props }: IMarkdownProps) {
  if (!value.length) return null;

  return (
    <span {...props} className="govuk-body markdown" dangerouslySetInnerHTML={{ __html: marked.parse(value) }}></span>
  );
}
