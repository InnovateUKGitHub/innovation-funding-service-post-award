import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import classNames from "classnames";

export interface IMarkdownProps {
  value: string;
  trusted?: boolean;
  verticalScrollbar?: boolean;
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
export function Markdown({ value, trusted = false, verticalScrollbar, ...props }: IMarkdownProps) {
  if (!value.length) return null;

  let content = value;

  if (!trusted) {
    // Sanitise input Markdown to remove HTML.
    content = DOMPurify.sanitize(value, {
      ALLOWED_TAGS: [
        "a",
        "abbr",
        "acronym",
        "b",
        "blockquote",
        "br",
        "caption",
        "code",
        "col",
        "colgroup",
        "div",
        "figure",
        "figcaption",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "i",
        "kbd",
        "li",
        "ol",
        "p",
        "pre",
        "s",
        "small",
        "span",
        "strike",
        "strong",
        "table",
        "tbody",
        "td",
        "tfoot",
        "th",
        "thead",
        "tr",
        "u",
        "ul",
      ],
    });
  }

  return (
    <span
      {...props}
      className={classNames("govuk-body", "markdown", {
        "acc-height-container acc-vertical-scrollbar": verticalScrollbar,
      })}
      dangerouslySetInnerHTML={{ __html: marked.parse(content, { renderer }) }}
    ></span>
  );
}
