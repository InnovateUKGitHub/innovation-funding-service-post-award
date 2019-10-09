import React from "react";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { getPartner } from "@ui/redux/selectors";
import { StoresConsumer } from "@ui/redux";

interface Props {
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRItemForAccountNameChangeDto;
}

interface InnerProps {
  documents: DocumentSummaryDto[];
}

const InnerContainer = (props: Props & InnerProps) => {
  const partnerName = props.projectChangeRequestItem.partnerId ? getPartner(props.projectChangeRequestItem.partnerId) : "";
  return (
    <React.Fragment>
      <ACC.SummaryList qa="nameChangeSummaryList">
        <ACC.SummaryListItem label="Current partner name" content={partnerName} qa="currentPartnerName" />
        <ACC.SummaryListItem label="New partner name" content={props.projectChangeRequestItem.accountName} qa="newPartnerName" />
      </ACC.SummaryList>
      <ACC.Section title="Change of name certificate" subtitle={props.documents.length > 0 ? "All documents open in a new window." : ""} >
        {renderDocuments(props.documents)}
      </ACC.Section>
    </React.Fragment>
  );
};

const renderDocuments = (documents: DocumentSummaryDto[]) => {
  return documents.length > 0
    ? <ACC.DocumentList documents={documents} qa="documentsList"/>
    : <ACC.Renderers.SimpleString>No documents uploaded.</ACC.Renderers.SimpleString>;
};

export const NameChangeView = (props: Props) => (
  <StoresConsumer>
    {
      stores => (
        <ACC.Loader
          pending={stores.documents.pcrOrPcrItemDocuments(props.projectChangeRequest.projectId, props.projectChangeRequestItem.id)}
          render={documents => <InnerContainer documents={documents} {...props}/>}
        />
      )
    }
  </StoresConsumer>
);
