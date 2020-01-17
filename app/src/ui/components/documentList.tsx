import * as React from "react";
import { stringComparator } from "@framework/util/comparator";
import { LinksList } from "./linksList";
import { TypedForm } from "./form";

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
