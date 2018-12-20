import * as React from "react";
import { LinksList, TypedForm } from "./";

interface Props {
  documents: DocumentSummaryDto[];
  qa: string;
}

const mapDocumentToLink = (document: DocumentSummaryDto, i: number) => ({
  url: document.link,
  text: document.fileName,
  qa: `document-${i}`,
});

const sorter = (a: DocumentSummaryDto, b: DocumentSummaryDto) => a.fileName.toLowerCase().localeCompare(b.fileName.toLowerCase());
const sortDocuments = (documents: DocumentSummaryDto[]) => { documents.sort(sorter); };

export const DocumentList: React.SFC<Props> = ({ documents = [], qa}: Props) => {
  sortDocuments(documents);
  return (
    <div data-qa={qa}>
      <LinksList openNewWindow={true} links={documents.map(mapDocumentToLink)}/>
    </div>
  );
};

interface PropsWithRemove extends Props {
  onRemove: (d: DocumentSummaryDto) => void;
}

export const DocumentListWithDelete: React.SFC<PropsWithRemove> = ({ documents = [], qa, onRemove }: PropsWithRemove) => {
  sortDocuments(documents);
  const Form = TypedForm<DocumentSummaryDto[]>();
  return (
    <div data-qa={qa}>
      <Form.Form data={documents}>
        {documents.map((dto, i) => (
          <div className="govuk-!-padding-bottom-4" key={`document-${i}`}>
            <a target={"_blank"} href={dto.link} className="govuk-link govuk-!-font-size-19" data-qa={qa}>{dto.fileName}</a>
            <Form.Button name="delete" value={dto.id} styling="Link" style={({ marginLeft: "15px" })} onClick={() => onRemove(dto)} className="govuk-!-font-size-19">Remove</Form.Button>
          </div>
          ))}
      </Form.Form>
    </div>
  );
};
