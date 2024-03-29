import { getDocumentDescriptionContentSelector } from "@framework/constants/documentDescription";
import { DocumentSummaryDto, PartnerDocumentSummaryDto } from "@framework/dtos/documentDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { getFileSize } from "@framework/util/files";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { createTypedForm } from "../../../../bjss/form/form";
import { DocumentsBase } from "../utils/documents.interface";
import { DocumentsUnavailable } from "../DocumentsUnavailable/DocumentsUnavailable";
import { ProjectPartnerDocumentEditProps } from "../DocumentView/DocumentView";
import { FormTypes } from "@ui/zod/FormTypes";

export interface DocumentTableProps<T extends DocumentSummaryDto> extends DocumentsBase<T> {
  customContent?: (
    table: ReturnType<typeof createTypedTable<T>>,
  ) => UnwrapArray<Parameters<ReturnType<typeof createTypedTable<T>>["Table"]>["0"]["children"]>;
}

const Form = createTypedForm<DocumentSummaryDto[]>();

export const DocumentTable = <T extends DocumentSummaryDto>({
  documents = [],
  qa,
  customContent,
}: DocumentTableProps<T>) => {
  const ProjectDocumentsTable = createTypedTable<T>();

  return (
    <ProjectDocumentsTable.Table data={documents} qa={qa} initialSortKey="dateCreated" initialSortState="descending">
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
        value={x => <Content value={getDocumentDescriptionContentSelector(x.description)} />}
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
};

export interface DocumentTableWithDeleteProps<T extends DocumentSummaryDto> extends DocumentsBase<T> {
  hideRemove?: (d: T) => boolean;
  onRemove: (d: T) => void;
  disabled?: boolean;
  formType?:
    | FormTypes.ProjectLevelDelete
    | FormTypes.ClaimLevelDelete
    | FormTypes.PcrLevelDelete
    | FormTypes.ClaimDetailLevelDelete;
}

export const DocumentTableWithDelete: React.FunctionComponent<DocumentTableWithDeleteProps<DocumentSummaryDto>> = ({
  documents = [],
  qa,
  hideRemove,
  onRemove,
  disabled,
  formType,
}: DocumentTableWithDeleteProps<DocumentSummaryDto>) => {
  if (!documents.length) return <DocumentsUnavailable />;

  return (
    <Form.Form data={documents}>
      {formType && <Form.Hidden name="form" value={() => formType} />}
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
                  name={formType ? "documentId" : "delete"} // "documentId" for RHF, "delete" for old forms
                  styling="Link"
                  style={{ marginLeft: "15px" }}
                  onClick={() => onRemove(x)}
                  value={x.id}
                  disabled={!x.isOwner || disabled}
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
  disabled,
}: DocumentTableWithDeleteProps<PartnerDocumentSummaryDto> &
  ProjectPartnerDocumentEditProps<PartnerDocumentSummaryDto>) => {
  if (!documents.length) return <DocumentsUnavailable />;

  const Form = createTypedForm<PartnerDocumentSummaryDto[]>();
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
              <Form.Form data={documents} qa={`${qa}-form`}>
                <Form.Button
                  name="documentId"
                  styling="Link"
                  style={{ marginLeft: "15px" }}
                  onClick={() => onRemove(x)}
                  value={x.id}
                  disabled={!x.isOwner || disabled}
                >
                  Remove
                </Form.Button>
                <Form.Hidden name="partnerId" value={() => x.partnerId} />
                <Form.Hidden name="form" value={() => FormTypes.PartnerLevelDelete} />
              </Form.Form>
            );
          }}
        />,
      ]}
    />
  );
};
