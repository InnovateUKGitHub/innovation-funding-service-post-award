import * as React from "react";
import { stringComparator } from "@framework/util/comparator";
import { LinksList } from "./linksList";
import { TypedForm } from "./form";
import { TypedTable } from "@ui/components/table";
import { getFileSize } from "../../framework/util/files";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { Content } from "@ui/components/content";

interface Props {
  documents: DocumentSummaryDto[];
  qa: string;
}

const mapDocumentToLink = (document: DocumentSummaryDto, i: number) => ({
  url: document.link,
  text: document.fileName,
  qa: `document-${i}`,
});

export const DocumentList: React.FunctionComponent<Props> = ({ documents = [], qa}: Props) => {
  // @TODO: should server not do this?
  documents.sort((a,b) => stringComparator(a.fileName, b.fileName));
  return (
    <div data-qa={qa}>
      <LinksList openNewWindow={true} links={documents.map(mapDocumentToLink)}/>
    </div>
  );
};

interface PropsWithRemove extends Props {
  onRemove: (d: DocumentSummaryDto) => void;
}

export const DocumentListWithDelete: React.FunctionComponent<PropsWithRemove> = ({ documents = [], qa, onRemove }: PropsWithRemove) => {
  // @TODO: should server not do this?
  documents.sort((a,b) => stringComparator(a.fileName, b.fileName));

  const Form = TypedForm<DocumentSummaryDto[]>();
  return (
    <div data-qa={qa}>
      <Form.Form data={documents}>
        {documents.map((dto, i) => (
          <div className="govuk-!-padding-bottom-4" key={`document-${i}`} data-qa={`row-document-${i}`}>
            <a target={"_blank"} href={dto.link} className="govuk-link govuk-!-font-size-19" data-qa={`document-${i}`}>{dto.fileName}</a>
            <Form.Button
              name="delete"
              styling="Link"
              className="govuk-!-font-size-19"
              style={({ marginLeft: "15px" })}
              onClick={() => onRemove(dto)}
              value={dto.id}
            >
              Remove
            </Form.Button>
          </div>
        ))}
      </Form.Form>
    </div>
  );
};

const renderDocumentName = (document: DocumentSummaryDto) => {
  return <a target={"_blank"} href={document.link} className="govuk-link">{document.fileName}</a>;
};

interface DocumentTableProps extends Props {
  hideRemove?: (d: DocumentSummaryDto) => boolean;
  onRemove?: (d: DocumentSummaryDto) => void;
}

export const DocumentTable: React.FunctionComponent<DocumentTableProps> = ({ documents = [], qa, hideRemove, onRemove }: DocumentTableProps) => {
  // @TODO: should server not do this?
  documents.sort((a,b) => stringComparator(a.fileName, b.fileName));
  const ProjectDocumentsTable = TypedTable<DocumentSummaryDto>();
  const Form = TypedForm<DocumentSummaryDto[]>();
  return (
      <Form.Form data={documents}>
        <ProjectDocumentsTable.Table data={documents} qa={qa}>
          <ProjectDocumentsTable.Custom header="File name" qa="fileName" value={x => renderDocumentName(x)} />
          <ProjectDocumentsTable.Custom header="Type" qa="fileType" value={x => x.description ? <Content value={c => c.components.documents.labels().documentDescriptionLabel(x.description!)}/> : null} />
          <ProjectDocumentsTable.ShortDate header="Date uploaded" qa="dateUploaded" value={x => x.dateCreated} />
          <ProjectDocumentsTable.Custom header="Size" qa="fileSize" classSuffix="numeric" value={x => getFileSize(x.fileSize)} />
          <ProjectDocumentsTable.String header="Uploaded by" qa="uploadedBy" value={x => x.uploadedBy} />
          {onRemove ? <ProjectDocumentsTable.Custom
            qa="delete"
            value={x => !hideRemove || !hideRemove(x) && <Form.Button
              name="delete"
              styling="Link"
              className="govuk-!-font-size-19"
              style={({ marginLeft: "15px" })}
              onClick={() => onRemove(x)}
              value={x.id}
            >
              Remove
            </Form.Button>}
          /> : null}
        </ProjectDocumentsTable.Table>
      </Form.Form>
  );
};
