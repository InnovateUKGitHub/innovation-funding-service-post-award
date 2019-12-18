import React from "react";
import * as ACC from "@ui/components";
import { standardItemStepNames, standardItemWorkflow } from "./workflow";
import { StoresConsumer } from "@ui/redux";
import { PcrStepProps, PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRStandardItemDto } from "@framework/dtos";
import { PCRStandardItemDtoValidator } from "@ui/validators";

interface Props {
  documents: DocumentSummaryDto[];
}

class SummaryComponent extends React.Component<PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, standardItemStepNames> & Props> {
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

export const Summary = (props: PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, standardItemStepNames>) => (
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
