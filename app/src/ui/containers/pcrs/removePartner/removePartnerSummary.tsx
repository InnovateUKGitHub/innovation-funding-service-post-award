import React from "react";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { removePartnerStepNames } from "@ui/containers/pcrs/removePartner/removePartnerWorkflow";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PCRStepId } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/content";
import { DocumentList } from "@ui/components/documents/DocumentList";
import { Section } from "@ui/components/layout/section";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Loader } from "@ui/components/loading";

interface InnerProps {
  documents: DocumentSummaryDto[];
}

class Component extends React.Component<
  PcrSummaryProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator, removePartnerStepNames> &
    InnerProps
> {
  render() {
    const { pcrItem, validator, documents } = this.props;
    return (
      <Section qa="remove-partner-summary">
        <SummaryList qa="remove-partner-summary-list">
          <SummaryListItem
            label={x => x.pcrRemovePartnerLabels.removedPartner}
            content={pcrItem.partnerNameSnapshot}
            validation={validator.partnerId}
            qa="partnerToRemove"
            action={this.props.getEditLink(PCRStepId.removalPeriodStep, validator.partnerId)}
          />
          <SummaryListItem
            label={x => x.pcrRemovePartnerLabels.lastPeriod}
            content={pcrItem.removalPeriod}
            validation={validator.removalPeriod}
            qa="removalPeriod"
            action={this.props.getEditLink(PCRStepId.removalPeriodStep, validator.removalPeriod)}
          />
          <SummaryListItem
            label={x => x.pcrRemovePartnerLabels.documents}
            content={this.renderDocuments(documents)}
            qa="supportingDocuments"
            action={this.props.getEditLink(PCRStepId.filesStep, null)}
          />
        </SummaryList>
      </Section>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[]) {
    return documents.length > 0 ? (
      <DocumentList documents={documents} qa="documentsList" />
    ) : (
      <Content value={x => x.documentMessages.noDocumentsUploaded} />
    );
  }
}

export const RemovePartnerSummary = (
  props: PcrSummaryProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator, removePartnerStepNames>,
) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id)}
      render={documents => <Component {...props} documents={documents} />}
    />
  );
};
