import React from "react";
import { PCRItemForAccountNameChangeDto } from "@framework/types";
import * as ACC from "../../../components";
import { StoresConsumer } from "@ui/redux";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { accountNameChangeStepNames } from "./accountNameChangeWorkflow";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

interface InnerProps {
  documents: DocumentSummaryDto[];
}

class Component extends React.Component<PcrSummaryProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator, accountNameChangeStepNames> & InnerProps> {
  render() {
    const { pcrItem, validator, documents } = this.props;
    return (
      <ACC.Section qa="name-change-summary">
        <ACC.SummaryList qa="name-change-summary-list">
          <ACC.SummaryListItem label="Existing name" content={pcrItem.partnerNameSnapshot} validation={validator.partnerId} qa="currentPartnerName" action={this.props.getEditLink("partnerNameStep", validator.partnerId)} />
          <ACC.SummaryListItem label="Proposed name" content={pcrItem.accountName} validation={validator.accountName} qa="newPartnerName" action={this.props.getEditLink("partnerNameStep", validator.accountName)} />
          <ACC.SummaryListItem label="Change of name certificate" content={this.renderDocuments(documents)} qa="supportingDocuments" action={this.props.getEditLink("filesStep", null)} />
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

export const NameChangeSummary = (props: PcrSummaryProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator, accountNameChangeStepNames>) => (
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
