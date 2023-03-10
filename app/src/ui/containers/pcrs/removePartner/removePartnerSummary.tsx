import React from "react";
import { PCRItemForPartnerWithdrawalDto } from "@framework/types";
import { useStores } from "@ui/redux";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { removePartnerStepNames } from "@ui/containers/pcrs/removePartner/removePartnerWorkflow";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import * as ACC from "../../../components";

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
      <ACC.Section qa="remove-partner-summary">
        <ACC.SummaryList qa="remove-partner-summary-list">
          <ACC.SummaryListItem
            label={x => x.pcrRemovePartnerLabels.removedPartner}
            content={pcrItem.partnerNameSnapshot}
            validation={validator.partnerId}
            qa="partnerToRemove"
            action={this.props.getEditLink("removalPeriodStep", validator.partnerId)}
          />
          <ACC.SummaryListItem
            label={x => x.pcrRemovePartnerLabels.lastPeriod}
            content={pcrItem.removalPeriod}
            validation={validator.removalPeriod}
            qa="removalPeriod"
            action={this.props.getEditLink("removalPeriodStep", validator.removalPeriod)}
          />
          <ACC.SummaryListItem
            label={x => x.pcrRemovePartnerLabels.documents}
            content={this.renderDocuments(documents)}
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
      <ACC.Content value={x => x.documentMessages.noDocumentsUploaded} />
    );
  }
}

export const RemovePartnerSummary = (
  props: PcrSummaryProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator, removePartnerStepNames>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id)}
      render={documents => <Component {...props} documents={documents} />}
    />
  );
};
