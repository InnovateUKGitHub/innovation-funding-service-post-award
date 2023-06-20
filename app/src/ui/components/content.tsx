import type { ContentSelector } from "@copy/type";
import { useContent } from "@ui/hooks/content.hook";
import { Trans } from "react-i18next";
import { Markdown } from "./renderers/markdown";

interface IContentProps {
  value: ContentSelector;
  styles?: React.CSSProperties;
  markdown?: boolean;
  components?: readonly React.ReactElement[] | { readonly [tagName: string]: React.ReactElement };
}

export const Content = ({ value, styles, markdown = false, components }: IContentProps) => {
  const { getContent, getContentCall } = useContent();

  if (components) {
    const { i18nKey, values } = getContentCall(value);

    return <Trans i18nKey={i18nKey} values={values} components={components} />;
  }

  const content = getContent(value);

  if (markdown) return <Markdown trusted style={styles && { color: styles.color }} value={content} />;

  return <>{content}</>;
};
