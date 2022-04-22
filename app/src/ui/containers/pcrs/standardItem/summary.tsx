import React from "react";
import * as ACC from "@ui/components";
import { useStores } from "@ui/redux";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRStandardItemDto } from "@framework/dtos";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { StandardItemStepNames } from "./workflow";

interface Props {
  documents: DocumentSummaryDto[];
}

class SummaryComponent extends React.Component<
  PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, StandardItemStepNames> & Props
> {
  public render() {
    return (
      <ACC.Section qa="standard-item-summary">
        <ACC.SummaryList qa="standard-item-summary-list">
          <ACC.SummaryListItem
            label="Documents"
            content={this.renderDocuments(this.props.documents)}
            qa="supportingDocuments"
            action={this.props.getEditLink("filesStep", null)}
          />
        </ACC.SummaryList>
      </ACC.Section>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[]) {
    return documents.length > 0 ? (
      <ACC.DocumentList documents={documents} qa="documentsList" />
    ) : (
      "No documents uploaded."
    );
  }
}

export const Summary = (
  props: PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, StandardItemStepNames>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id)}
      render={documents => <SummaryComponent {...props} documents={documents} />}
    />
  );
};
