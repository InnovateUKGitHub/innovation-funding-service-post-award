import { stringComparator } from "@framework/util/comparator";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { createTypedForm } from "../form";
import { LinksList } from "../linksList";

import { DocumentsUnavailable } from "./DocumentsUnavailable";
import { DocumentsBase } from "./documents.interface";

export const DocumentList = ({ documents = [], qa }: DocumentsBase) => {
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

interface DocumentListWithDeleteProps extends DocumentsBase {
  onRemove: (d: DocumentSummaryDto) => void;
}

const Form = createTypedForm<DocumentSummaryDto[]>();

export const DocumentListWithDelete = ({ documents = [], qa, onRemove }: DocumentListWithDeleteProps) => {
  if (!documents.length) return <DocumentsUnavailable />;

  // @TODO: should server not do this?
  documents.sort((a, b) => stringComparator(a.fileName, b.fileName));

  return (
    <div data-qa={qa}>
      <Form.Form data={documents}>
        {documents.map((dto, i) => (
          <div className="govuk-!-padding-bottom-4" key={`document-${i}`} data-qa={`row-document-${i}`}>
            <a
              target="_blank"
              rel="noreferrer"
              href={dto.link}
              className="govuk-link govuk-!-font-size-19"
              data-qa={`document-${i}`}
            >
              {dto.fileName}
            </a>

            <Form.Button
              name="delete"
              styling="Link"
              className="govuk-!-font-size-19"
              style={{ marginLeft: "15px" }}
              onClick={() => onRemove(dto)}
              value={dto.id}
              disabled={!dto.isOwner}
            >
              Remove
            </Form.Button>
          </div>
        ))}
      </Form.Form>
    </div>
  );
};
