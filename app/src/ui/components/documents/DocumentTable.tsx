import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { getFileSize } from "@framework/util/files";

import { ITypedTable, TableChild, TypedTable } from "@ui/components/table";
import { Content } from "@ui/components/content";
import { TypedForm } from "../form";
import { DocumentsBase } from "./documents.interface";
import { DocumentsUnavailable } from "./DocumentsUnavailable";

export interface DocumentTableProps extends DocumentsBase {
  customContent?: (table: ITypedTable<DocumentSummaryDto>) => TableChild<DocumentSummaryDto>;
}

export function DocumentTable({ documents = [], qa, customContent }: DocumentTableProps) {
  const ProjectDocumentsTable = TypedTable<DocumentSummaryDto>();

  return (
    <ProjectDocumentsTable.Table data={documents} qa={qa}>
      <ProjectDocumentsTable.Custom
        sortByKey="fileName"
        header="File name"
        qa="fileName"
        value={document => (
          <a target="_blank" rel="noreferrer" href={document.link} className="govuk-link">
            {document.fileName}
          </a>
        )}
      />

      <ProjectDocumentsTable.Custom
        header="Type"
        qa="fileType"
        value={x =>
          x.description ? (
            <Content value={c => c.components.documents.labels.documentDescriptionLabel(x.description!)} />
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

      <ProjectDocumentsTable.String
        sortByKey="uploadedBy"
        header="Uploaded by"
        qa="uploadedBy"
        value={x => x.uploadedBy}
      />

      {customContent ? customContent(ProjectDocumentsTable) : null}
    </ProjectDocumentsTable.Table>
  );
}

export interface DocumentTableWithDeleteProps extends DocumentsBase {
  hideRemove?: (d: DocumentSummaryDto) => boolean;
  onRemove: (d: DocumentSummaryDto) => void;
}

export const DocumentTableWithDelete: React.FunctionComponent<DocumentTableWithDeleteProps> = ({
  documents = [],
  qa,
  hideRemove,
  onRemove,
}: DocumentTableWithDeleteProps) => {
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
