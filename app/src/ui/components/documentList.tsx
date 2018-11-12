import * as React from "react";
import { LinksList } from "./linksList";
import { Button } from "./styledButton";

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
  const renderRemove = (index: number) => <Button style={({marginLeft: "15px"})} className="govuk-!-font-size-19" onClick={() => onRemove(documents[index])} styling="Link">Remove</Button>;
  return (
    <div data-qa={qa}>
      <LinksList renderAfterLink={renderRemove} openNewWindow={true} links={documents.map(mapDocumentToLink)}/>
    </div>
  );
};
