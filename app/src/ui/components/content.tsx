import type { ContentSelector } from "@copy/type";
import { useContent } from "@ui/hooks";
import { Markdown } from "./renderers/markdown";

interface IContentProps {
  value: ContentSelector;
  markdown?: boolean;
  styles?: React.CSSProperties;
}

export const Content = ({ value, styles, markdown = false }: IContentProps) => {
  const { getContent } = useContent();

  const content = getContent(value);

  return markdown ? <Markdown trusted style={styles && { color: styles.color }} value={content} /> : <>{content}</>;
};
