import React from "react";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { StoresConsumer } from "@ui/redux";

interface Props {
  projectChangeRequest: Dtos.PCRDto;
  projectChangeRequestItem: Dtos.PCRStandardItemDto;
}

interface InnerProps {
  files: DocumentSummaryDto[];
}

const InnerContainer = (props: Props & InnerProps) => (
  <ACC.SummaryList qa="pcr_viewItem">
    <ACC.SummaryListItem label="Request number" content={props.projectChangeRequest.requestNumber} qa="numberRow" />
    <ACC.SummaryListItem label="Type" content={props.projectChangeRequestItem.typeName} qa="type" />
    <ACC.SummaryListItem
      label="Files"
      qa="files"
      content={props.files.length ? <ACC.DocumentList documents={props.files} qa="docs" /> : "No documents attached"}
    />
  </ACC.SummaryList>
);

export const StandardItemView = (props: Props) => (
  <StoresConsumer>
    {
      stores => (
        <ACC.Loader
          pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectChangeRequest.projectId, props.projectChangeRequestItem.id)}
          render={files => <InnerContainer files={files} {...props} />}
        />
      )
    }
  </StoresConsumer>
);
