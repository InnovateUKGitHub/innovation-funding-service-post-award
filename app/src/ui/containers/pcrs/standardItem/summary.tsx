import React from "react";
import * as ACC from "@ui/components";
import { SummaryProps } from "../workflow";
import { standardItemWorkflow } from "./workflow";
import { StoresConsumer } from "@ui/redux";

interface Props {
  documents: DocumentSummaryDto[];
}

class SummaryComponent extends React.Component<SummaryProps<typeof standardItemWorkflow> & Props> {
  public render() {
    return (
      <ACC.Section qa="standard-item-summary">
        <ACC.SummaryList qa="standard-item-summary-list">
          <ACC.SummaryListItem label="Documents" content={this.renderDocuments(this.props.documents)} qa="supportingDocuments" action={this.props.getEditLink("filesStep", null)} />
        </ACC.SummaryList>
      </ACC.Section>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[]) {
    return documents.length > 0
      ? <ACC.DocumentList documents={documents} qa="documentsList" />
      : "No documents uploaded.";
  }
}

export const Summary = (props: SummaryProps<typeof standardItemWorkflow>) => (
  <StoresConsumer>
    {
      stores => {
        return (<ACC.Loader
          pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id)}
          render={documents => <SummaryComponent documents={documents} {...props} />}
        />);
      }
    }
  </StoresConsumer>
);
