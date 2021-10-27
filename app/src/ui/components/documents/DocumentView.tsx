import { cloneElement } from "react";

import { useContent } from "@ui/hooks";
import { H2 } from "../typography";
import { SimpleString } from "../renderers";

import {
  DocumentTable,
  DocumentTableProps,
  DocumentTableWithDelete,
  DocumentTableWithDeleteProps,
} from "./DocumentTable";
import { DocumentFilter } from "./DocumentFilter";
import { DocumentsUnavailable } from "./DocumentsUnavailable";
import { DocumentsBase } from "./documents.interface";
import { useDocumentSearch } from "./document-search.hook";

export interface DocumentShow {
  validationMessage?: string;
  disableSearch?: boolean;
  hideHeader?: boolean;
}

interface DocumentDisplayProps
  extends Partial<Pick<DocumentShow, "disableSearch" | "hideHeader">>,
    Pick<DocumentsBase, "documents"> {
  children: React.ReactElement<DocumentViewProps> | React.ReactElement<DocumentEditProps>;
}

function DocumentDisplay({
  hideHeader,
  disableSearch = false,
  documents: unCheckedDocuments,
  children,
}: DocumentDisplayProps) {
  const { getContent } = useContent();
  const { displaySearch, hasDocuments, documents, filterConfig } = useDocumentSearch(disableSearch, unCheckedDocuments);

  return (
    <>
      {!hideHeader && <H2>{getContent(x => x.components.documents.labels.documentDisplayTitle)}</H2>}

      {hasDocuments && (
        <SimpleString>{getContent(x => x.components.documents.labels.documentDisplaySubTitle)}</SimpleString>
      )}

      {displaySearch && <DocumentFilter qa="document-filter" {...filterConfig} />}

      {hasDocuments ? (
        cloneElement(children, { ...children.props, documents })
      ) : (
        <DocumentsUnavailable removeSpacing={hideHeader} validationMessage={children.props.validationMessage} />
      )}
    </>
  );
}

export type DocumentViewProps = DocumentShow & DocumentTableProps;

export const DocumentView = (props: DocumentViewProps) => {
  return (
    <DocumentDisplay {...props}>
      <DocumentTable {...props} qa={`${props.qa}-container`} />
    </DocumentDisplay>
  );
};

export type DocumentEditProps = DocumentShow & DocumentTableWithDeleteProps;

export const DocumentEdit = (props: DocumentEditProps) => {
  return (
    <DocumentDisplay {...props}>
      <DocumentTableWithDelete {...props} qa={`${props.qa}-container`} />
    </DocumentDisplay>
  );
};
