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
    const { documents, mode, getStepLink } = this.props;
    return (
      <ACC.Section qa="name-change-summary">
        <ACC.SummaryList qa="name-change-summary-list">
          <ACC.SummaryListItem label="Documents" content={this.renderDocuments(documents)} qa="supportingDocuments" action={mode === "prepare" && <ACC.Link route={getStepLink("filesStep")}>Edit</ACC.Link>} />
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
