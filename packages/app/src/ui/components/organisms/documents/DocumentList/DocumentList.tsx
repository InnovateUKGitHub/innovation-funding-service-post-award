import { stringComparator } from "@framework/util/comparator";
import { LinksList } from "../../../atoms/LinksList/linksList";

import { DocumentsUnavailable } from "../DocumentsUnavailable/DocumentsUnavailable";
import { DocumentsBase } from "../utils/documents.interface";

export const DocumentList = ({ documents, qa }: DocumentsBase) => {
  if (!documents.length) return <DocumentsUnavailable />;

  // @TODO: should server not do this?
  documents.sort((a, b) => stringComparator(a.fileName, b.fileName));

  const listItems = documents.map((document, i) => ({
    url: document.link,
    text: document.fileName,
    qa: `document-${i}`,
  }));

  return (
    <div data-qa={qa}>
      <LinksList openNewWindow links={listItems} />
    </div>
  );
};
