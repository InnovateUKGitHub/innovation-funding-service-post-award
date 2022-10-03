import { DocumentDescription } from "@framework/constants";
import { DocumentSummaryDto, PartnerDocumentSummaryDto } from "@framework/dtos/documentDto";
import { getAuthRoles } from "@framework/types";
import { getFileSize } from "@framework/util/files";
import { Content } from "@ui/components/content";
import { ITypedTable, TypedTable } from "@ui/components/table";
import { TypedForm } from "../form";
import { DocumentsBase } from "./documents.interface";
import { DocumentsUnavailable } from "./DocumentsUnavailable";
import { ProjectPartnerDocumentEditProps } from "./DocumentView";

export interface DocumentTableProps<T extends DocumentSummaryDto> extends DocumentsBase<T> {
  customContent?: (table: ITypedTable<T>) => any;
}

export const DocumentTable = <T extends DocumentSummaryDto>({
  documents = [],
  qa,
  customContent,
}: DocumentTableProps<T>) => {
  const ProjectDocumentsTable = TypedTable<T>();

  return (
    <ProjectDocumentsTable.Table data={documents} qa={qa}>
      <ProjectDocumentsTable.Custom
        sortByKey="fileName"
        header="File name"
        qa="fileName"
        value={document => {
          return (
            <a target="_blank" rel="noreferrer" href={document.link} className="govuk-link">
              {document.fileName}
            </a>
          );
        }}
      />

      <ProjectDocumentsTable.Custom
        header="Type"
        qa="fileType"
        value={x =>
          x.description ? (
            <Content
              value={c => c.components.documents.labels.documentDescriptionLabel(x.description as DocumentDescription)}
            />
          ) : null
        }
      />

      <ProjectDocumentsTable.ShortDate
        sortByKey="dateCreated"
        header="Date uploaded"
        qa="dateUploaded"
        value={x => x.dateCreated}
      />

      <ProjectDocumentsTable.Custom
        sortByKey="fileSize"
        header="Size"
        qa="fileSize"
        classSuffix="numeric"
        value={x => getFileSize(x.fileSize)}
      />

      <ProjectDocumentsTable.Custom
        sortByKey="uploadedBy"
        header="Uploaded by"
        qa="uploadedBy"
        value={x => `${x.uploadedBy}${x.uploadedByPartnerName ? ` of ${x.uploadedByPartnerName}` : ""}`}
      />

      {customContent ? customContent(ProjectDocumentsTable) : null}
    </ProjectDocumentsTable.Table>
  );
};

export interface DocumentTableWithDeleteProps<T extends DocumentSummaryDto> extends DocumentsBase<T> {
  hideRemove?: (d: T) => boolean;
  onRemove: (d: T) => void;
}

export const DocumentTableWithDelete: React.FunctionComponent<DocumentTableWithDeleteProps<DocumentSummaryDto>> = ({
  documents = [],
  qa,
  hideRemove,
  onRemove,
}: DocumentTableWithDeleteProps<DocumentSummaryDto>) => {
  if (!documents.length) return <DocumentsUnavailable />;

  const Form = TypedForm<DocumentSummaryDto[]>();

  return (
    <Form.Form data={documents}>
      <DocumentTable
        qa={qa}
        documents={documents}
        customContent={table => (
          <table.Custom
            qa="delete"
            value={x => {
              if (hideRemove && hideRemove(x)) return null;

              return (
                <Form.Button
                  name="delete"
                  styling="Link"
                  className="govuk-!-font-size-19"
                  style={{ marginLeft: "15px" }}
                  onClick={() => onRemove(x)}
                  value={x.id}
                  disabled={!x.isOwner}
                >
                  Remove
                </Form.Button>
              );
            }}
          />
        )}
      />
    </Form.Form>
  );
};

export const PartnerDocumentTableWithDelete: React.FunctionComponent<
  DocumentTableWithDeleteProps<PartnerDocumentSummaryDto> & ProjectPartnerDocumentEditProps<PartnerDocumentSummaryDto>
> = ({
  project,
  documents = [],
  qa,
  hideRemove,
  onRemove,
}: DocumentTableWithDeleteProps<PartnerDocumentSummaryDto> &
  ProjectPartnerDocumentEditProps<PartnerDocumentSummaryDto>) => {
  if (!documents.length) return <DocumentsUnavailable />;

  const Form = TypedForm<PartnerDocumentSummaryDto[]>();
  const { isMo } = getAuthRoles(project.roles);

  return (
    <DocumentTable
      qa={qa}
      documents={documents}
      customContent={table => [
        isMo ? (
          <table.String
            key=".5"
            qa="shared-with"
            header="Shared with"
            sortByKey="partnerName"
            value={x => x.partnerName}
          />
        ) : null,
        <table.Custom
          key=".6"
          qa="delete"
          value={x => {
            if (hideRemove && hideRemove(x)) return null;

            return (
              <Form.Form data={documents}>
                <Form.Button
                  name="delete"
                  styling="Link"
                  className="govuk-!-font-size-19"
                  style={{ marginLeft: "15px" }}
                  onClick={() => onRemove(x)}
                  value={x.id}
                  disabled={!x.isOwner}
                >
                  Remove
                </Form.Button>
                <Form.Hidden name="partnerId" value={_ => x.partnerId} />
              </Form.Form>
            );
          }}
        />,
      ]}
    />
  );
};
