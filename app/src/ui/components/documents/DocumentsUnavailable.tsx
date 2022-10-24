import { useContent } from "@ui/hooks";
import { SimpleString } from "@ui/components/renderers";

export interface DocumentsUnavailableProps {
  validationMessage?: string;
  removeSpacing?: boolean;
}

export function DocumentsUnavailable({ removeSpacing, validationMessage }: DocumentsUnavailableProps) {
  const { getContent } = useContent();

  return (
    <SimpleString className={removeSpacing ? "govuk-!-margin-0" : "govuk-!-margin-top-5"}>
      {validationMessage || getContent(x => x.documentMessages.noDocumentsUploaded)}
    </SimpleString>
  );
}
