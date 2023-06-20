import { DocumentSummaryDto, PartnerDocumentSummaryDto } from "@framework/dtos/documentDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { useContent } from "@ui/hooks/content.hook";
import React from "react";
import { SimpleString } from "../renderers/simpleString";
import { H2 } from "../typography/Heading.variants";
import { useDocumentSearch } from "./document-search.hook";
import { DocumentFilter } from "./DocumentFilter";
import { DocumentsUnavailable } from "./DocumentsUnavailable";
import {
  DocumentTable,
  DocumentTableProps,
  DocumentTableWithDelete,
  DocumentTableWithDeleteProps,
  PartnerDocumentTableWithDelete,
} from "./DocumentTable";

export interface DocumentShow {
  validationMessage?: string;
  disableSearch?: boolean;
  hideHeader?: boolean;
  hideSubtitle?: boolean;
}

interface DocumentDisplayProps<T extends DocumentSummaryDto>
  extends Partial<Pick<DocumentShow, "disableSearch" | "hideHeader" | "hideSubtitle">> {
  children: (documents: T[]) => React.ReactElement<DocumentViewProps<T>> | React.ReactElement<DocumentEditProps<T>>;
  documents: T[];
}

/**
 * Component displays uploaded documents
 */
function DocumentDisplay<
  T extends Pick<
    DocumentSummaryDto,
    "id" | "dateCreated" | "fileSize" | "fileName" | "link" | "uploadedBy" | "isOwner" | "description"
  >,
>({
  hideHeader,
  hideSubtitle,
  disableSearch = false,
  documents: unCheckedDocuments,
  children,
}: DocumentDisplayProps<T>) {
  const { getContent } = useContent();
  const { displaySearch, hasDocuments, documents, filterConfig } = useDocumentSearch(disableSearch, unCheckedDocuments);

  return (
    <>
      {!hideHeader && <H2>{getContent(x => x.documentLabels.documentDisplayTitle)}</H2>}

      {!hideSubtitle && hasDocuments && (
        <SimpleString>{getContent(x => x.documentLabels.documentDisplaySubTitle)}</SimpleString>
      )}

      {displaySearch && <DocumentFilter qa="document-filter" {...filterConfig} />}

      {hasDocuments ? (
        children(documents)
      ) : (
        <DocumentsUnavailable
          removeSpacing={hideHeader}
          validationMessage={children(documents).props.validationMessage}
        />
      )}
    </>
  );
}

export type DocumentViewProps<T extends DocumentSummaryDto> = DocumentShow & DocumentTableProps<T>;

export const DocumentView = <T extends DocumentSummaryDto>(props: DocumentViewProps<T>) => {
  return (
    <DocumentDisplay {...props}>
      {documents => <DocumentTable {...props} qa={`${props.qa}-container`} documents={documents} />}
    </DocumentDisplay>
  );
};

export type DocumentEditProps<T extends DocumentSummaryDto> = DocumentShow & DocumentTableWithDeleteProps<T>;
export type ProjectPartnerDocumentEditProps<T extends DocumentSummaryDto> = DocumentEditProps<T> & {
  project: Pick<ProjectDto, "roles">;
};

export const DocumentEdit = (props: DocumentEditProps<DocumentSummaryDto>) => {
  return (
    <DocumentDisplay {...props}>
      {documents => <DocumentTableWithDelete {...props} qa={`${props.qa}-container`} documents={documents} />}
    </DocumentDisplay>
  );
};

export const PartnerDocumentEdit = (props: ProjectPartnerDocumentEditProps<PartnerDocumentSummaryDto>) => {
  return (
    <DocumentDisplay {...props}>
      {documents => <PartnerDocumentTableWithDelete {...props} qa={`${props.qa}-container`} documents={documents} />}
    </DocumentDisplay>
  );
};
