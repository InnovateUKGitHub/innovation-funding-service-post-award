import React from "react";
import { PcrSummaryProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { removePartnerStepNames } from "@ui/containers/pages/pcrs/removePartner/removePartnerWorkflow";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { Loader } from "@ui/components/bjss/loading";

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
            action={this.props.getEditLink(PCRStepType.removalPeriodStep, validator.partnerId)}
          />
          <SummaryListItem
            label={x => x.pcrRemovePartnerLabels.lastPeriod}
            content={pcrItem.removalPeriod}
            validation={validator.removalPeriod}
            qa="removalPeriod"
            action={this.props.getEditLink(PCRStepType.removalPeriodStep, validator.removalPeriod)}
          />
          <SummaryListItem
            label={x => x.pcrRemovePartnerLabels.documents}
            content={this.renderDocuments(documents)}
            qa="supportingDocuments"
            action={this.props.getEditLink(PCRStepType.filesStep, null)}
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
