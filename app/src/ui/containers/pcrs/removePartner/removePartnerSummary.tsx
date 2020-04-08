import React from "react";
import { PCRItemForPartnerWithdrawalDto } from "@framework/types";
import * as ACC from "../../../components";
import { StoresConsumer } from "@ui/redux";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { removePartnerStepNames } from "@ui/containers/pcrs/removePartner/removePartnerWorkflow";
import { periodInProject } from "@framework/util";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

interface InnerProps {
  documents: DocumentSummaryDto[];
}

class Component extends React.Component<PcrSummaryProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator, removePartnerStepNames> & InnerProps> {
  render() {
    const { pcrItem, validator, documents, project } = this.props;
    return (
      <ACC.Section qa="remove-partner-summary">
        <ACC.SummaryList qa="remove-partner-summary-list">
          <ACC.SummaryListItem label="Partner being removed" content={pcrItem.partnerNameSnapshot} validation={validator.partnerId} qa="partnerToRemove" action={this.props.getEditLink("withdrawalDateStep", validator.partnerId)} />
          <ACC.SummaryListItem label="Removal date" content={<ACC.Renderers.ShortDate value={pcrItem.withdrawalDate} />} validation={validator.withdrawalDate} qa="withdrawalDate" action={this.props.getEditLink("withdrawalDateStep", validator.withdrawalDate)} />
          <ACC.SummaryListItem label="Period" content={periodInProject(pcrItem.withdrawalDate, project)} qa="withdrawalPeriod" />
          <ACC.SummaryListItem label="Documents" content={this.renderDocuments(documents)} qa="supportingDocuments" action={this.props.getEditLink("filesStep", null)} />
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

export const RemovePartnerSummary = (props: PcrSummaryProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator, removePartnerStepNames>) => (
  <StoresConsumer>
    {
      stores => {
        return (<ACC.Loader
          pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id)}
          render={documents => <Component documents={documents} {...props} />}
        />);
      }
    }
  </StoresConsumer>
);
