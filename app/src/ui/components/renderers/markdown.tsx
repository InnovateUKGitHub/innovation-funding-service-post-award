import { marked } from "marked";

export interface IMarkdownProps {
  value: string;
  trusted?: boolean;
  style?: React.CSSProperties;
}

// Create a Markdown renderer
const renderer = new marked.Renderer();

// Get a copy of the existing link renderer
const linkRenderer = renderer.link;

// ...and overwrite it, by calling it, and replacing it's output.
// https://github.com/markedjs/marked/issues/655#issuecomment-383226346
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text);
  return html.replace(/^<a /, '<a target="_blank" ');
};

/**
 * Renders a component that renders a string using markdown syntax.
 *
 * Warning! it is possible that this will produce differences in the rendering
 * between server side and client side. Especially if wrapped in other components
 * and parents. E.g. if `<Content>` wrapped in `<SimpleString>`
 */
export function Markdown({ value, trusted = false, ...props }: IMarkdownProps) {
  if (!value.length) return null;

  if (!trusted) {
    value = value
      .replace("&", "&amp;") // Replace ampersands to keep them available
      .replace("<", "&lt;") // Replace < and > to ensure HTML is not injected
      .replace(">", "&gt;");
  }

  return (
    <span
      {...props}
      className="govuk-body markdown"
      dangerouslySetInnerHTML={{ __html: marked.parse(value, { renderer }) }}
    ></span>
  );
}
