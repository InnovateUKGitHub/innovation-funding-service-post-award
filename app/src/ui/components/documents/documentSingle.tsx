import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { useContent } from "@ui/hooks";
import { SimpleString } from "../renderers";

export interface DocumentSingleProps {
  document: Pick<DocumentSummaryDto, "link" | "fileName">;
  message?: string;
  openNewWindow?: boolean;
  qa?: string;
  removeElement?: React.ReactNode;
}

export function DocumentSingle({ message, document, openNewWindow, qa, removeElement }: DocumentSingleProps) {
  const { getContent } = useContent();
  const newWindowText = getContent((x) => x.components.documentSingle.newWindow);
  const newWindowMessage = ` (${newWindowText})`;

  return (
    <div>
      {message && (
        <div className="govuk-!-padding-bottom-3">
          <SimpleString qa="document-single-message">{message}</SimpleString>
        </div>
      )}

      <div className="govuk-!-padding-bottom-3">
        {/* eslint-disable-next-line react/jsx-no-target-blank */}
        <a
          className="govuk-link govuk-!-font-size-19"
          target={openNewWindow ? "_blank" : undefined}
          rel={openNewWindow ? "noreferrer" : undefined}
          style={{ paddingRight: 20 }}
          href={document.link}
          data-qa={qa}
        >
          {document.fileName}
        </a>

        <SimpleString>{newWindowMessage}</SimpleString>
      </div>

      {removeElement}
    </div>
  );
}
