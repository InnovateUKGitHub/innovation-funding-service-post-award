import React, { Component } from "react";
import { Markdown } from "./renderers/markdown";
import { ContentConsumer } from "@ui/redux/contentProvider";
import { ContentSelector } from "@content/content";
import { StoresConsumer } from "@ui/redux";
import { Modal } from "@ui/components/modal";
import { Section } from "@ui/components/layout";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { ModalLink } from "@ui/components/links";
import { ContentResult } from "@content/contentBase";

interface Props {
  value: ContentSelector;
}
interface InnerProps {
  result: ContentResult;
  config: IFeatureFlags;
}

export const Content = ({ value }: Props) => (
  <StoresConsumer>{stores =>
    <ContentConsumer>{content =>
      <ContentComponent config={stores.config.getConfig().features} result={value(content)}/>}
    </ContentConsumer>}
  </StoresConsumer>
);

class ContentComponent extends Component<InnerProps> {

  private renderContentHint(displayValue: string | JSX.Element) {
    if (!this.props.config.contentHint) return null;

    const modalId = `content-${this.props.result.key}`;

    return (
      <React.Fragment>
        &nbsp;
        <a aria-label="Open content modal dialogue" role="button" href={`#${modalId}`}>
          <i className="content-prompt__icon"/>
        </a>
        <Modal id={modalId}>
          <Section title="Content hint">
            <SummaryList qa="content_info">
              <SummaryListItem hideAction={true} label="Current value" content={displayValue} qa="current_value" />
              <SummaryListItem hideAction={true} label="Content key" content={this.props.result.key} qa="current_value" />
            </SummaryList>
            <ModalLink styling="PrimaryButton" modalId={modalId} open={false}>Close</ModalLink>
          </Section>
        </Modal>
      </React.Fragment>
    );
  }

  public render() {
    const displayValue = this.props.result.markdown ? <Markdown value={this.props.result.content}/> : this.props.result.content;
    return (
      <React.Fragment>
        {displayValue}
        {this.renderContentHint(displayValue)}
      </React.Fragment>
    );
  }
}
