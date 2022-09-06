import { useContent } from "@ui/hooks";
import { ContentSelector } from "@content/content";
import { useStores } from "@ui/redux";
import { Modal } from "@ui/components/modal";
import { Section } from "@ui/components/layout";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { ModalLink } from "@ui/components/links";
import { Markdown } from "./renderers/markdown";

interface IContentProps {
  value: ContentSelector;
  styles?: React.CSSProperties;
}

export const Content = ({ value, styles }: IContentProps) => {
  const stores = useStores();
  const { getResultByQuery } = useContent();

  const config = stores.config.getConfig().features;
  const { key, content, markdown } = getResultByQuery(value);

  const displayValue: string | React.ReactElement = markdown ? (
    <Markdown style={styles && { color: styles.color }} value={content} />
  ) : (
    content
  );

  const renderContentHint = () => {
    const modalId = `content-${key}`;

    return (
      <>
        &nbsp;
        <i
          aria-label="Open content modal dialogue"
          role="button"
          className="content-prompt__icon"
          tabIndex={0}
          onKeyDown={e => {
            e.preventDefault();
            e.stopPropagation();
            window.location.hash = `#${modalId}`;
          }}
        />
        <Modal id={modalId}>
          <Section title="Content hint">
            <SummaryList qa="content_info">
              <SummaryListItem label="Current value" content={displayValue} qa="current_value" />

              <SummaryListItem label="Content key" content={key} qa="current_value" />
            </SummaryList>

            <ModalLink styling="PrimaryButton" modalId={modalId} open={false}>
              Close
            </ModalLink>
          </Section>
        </Modal>
      </>
    );
  };

  return (
    <>
      {displayValue}
      {config.contentHint && renderContentHint()}
    </>
  );
};
