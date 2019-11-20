import React from "react";
import { PCRItemForAccountNameChangeDto } from "@framework/types";
import * as ACC from "../../../components";
import { StoresConsumer } from "@ui/redux";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { SummaryProps } from "@ui/containers/pcrs/workflow";
import { accountNameChangeWorkflow } from "./accountNameChangeWorkflow";

interface InnerProps {
  documents: DocumentSummaryDto[];
}

class Component extends React.Component<SummaryProps<typeof accountNameChangeWorkflow> & InnerProps> {
  render() {
    const {pcrItem, validator, documents} = this.props;
    return (
      <ACC.Section qa="name-change-summary">
        <ACC.SummaryList qa="name-change-summary-list">
          <ACC.SummaryListItem label="Existing name" content={pcrItem.partnerNameSnapshot} validation={validator.partnerId} qa="currentPartnerName" action={this.props.mode === "prepare" && <ACC.Link id={validator.partnerId.key} route={this.props.getStepLink("partnerNameStep")}>Edit</ACC.Link>}/>
          <ACC.SummaryListItem label="Proposed name" content={pcrItem.accountName} validation={validator.accountName} qa="newPartnerName" action={this.props.mode === "prepare" && <ACC.Link id={validator.accountName.key} route={this.props.getStepLink("partnerNameStep")}>Edit</ACC.Link>} />
          <ACC.SummaryListItem label="Change of name certificate" content={this.renderDocuments(documents)} qa="supportingDocuments" action={this.props.mode === "prepare" && <ACC.Link route={this.props.getStepLink("filesStep")}>Edit</ACC.Link>} />
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

export const NameChangeSummary = (props: SummaryProps<typeof accountNameChangeWorkflow>) => (
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
