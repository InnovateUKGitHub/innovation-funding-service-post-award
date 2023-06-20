import React from "react";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { StandardItemStepNames } from "./workflow";
import { PCRStepId } from "@framework/constants/pcrConstants";
import { PCRStandardItemDto } from "@framework/dtos/pcrDtos";
import { DocumentList } from "@ui/components/documents/DocumentList";
import { Section } from "@ui/components/layout/section";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { useStores } from "@ui/redux/storesProvider";
import { PCRStandardItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Loader } from "@ui/components/loading";

interface Props {
  documents: DocumentSummaryDto[];
}

class SummaryComponent extends React.Component<
  PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, StandardItemStepNames> & Props
> {
  public render() {
    return (
      <Section qa="standard-item-summary">
        <SummaryList qa="standard-item-summary-list">
          <SummaryListItem
            label="Documents"
            content={this.renderDocuments(this.props.documents)}
            qa="supportingDocuments"
            action={this.props.getEditLink(PCRStepId.filesStep, null)}
          />
        </SummaryList>
      </Section>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[]) {
    return documents.length > 0 ? <DocumentList documents={documents} qa="documentsList" /> : "No documents uploaded.";
  }
}

export const Summary = (
  props: PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, StandardItemStepNames>,
) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id)}
      render={documents => <SummaryComponent {...props} documents={documents} />}
    />
  );
};
