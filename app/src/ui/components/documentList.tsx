import * as React from "react";
import {LinksList} from "./linksList";

interface Props {
  documents: Document[];
  qa: string;
}
interface Document {
  link: string;
  fileName: string;
}

const mapDocumentToLink = (document: Document, i: number) => ({
  url: document.link,
  text: document.fileName,
  qa: `document-${i}`,
});

export const DocumentList: React.SFC<Props> = ({ documents = [], qa}: Props) => {
  documents.sort((a, b) => {
    return a.fileName.toLowerCase().localeCompare(b.fileName.toLowerCase());
  });
  return (
    <div data-qa={qa}>
      <LinksList openNewWindow={true} links={documents.map(mapDocumentToLink)}/>
    </div>
  );
};
