import * as ACC from "@ui/components";
import { Content } from "@content/content";
import { DocumentMessages } from "@content/messages/documentMessages";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";

export function DocumentGuidance() {
  const { getContent } = useContent();
  const stores = useStores();
  const { maxFileSize } = stores.config.getConfig().options;

  const uploadGuidance = getContent(x => x.components.documentGuidance.uploadGuidance);
  const fileSizeGuidance = getContent(x => x.components.documentGuidance.fileSize(maxFileSize));
  const fileNameGuidance = getContent(x => x.components.documentGuidance.uniqueFilename);
  const noFilesNumberLimitMessage = getContent(x => x.components.documentGuidance.noFilesNumberLimit);
  const fileTypesUploadMessage = getContent(x => x.components.documentGuidance.fileTypesUpload);
  const pdf = getContent(x => x.components.documentGuidance.pdfFiles);
  const text = getContent(x => x.components.documentGuidance.textFiles);
  const presentation = getContent(x => x.components.documentGuidance.presentationFiles);
  const spreadsheet = getContent(x => x.components.documentGuidance.spreadsheetFiles);
  const availableImageExtensions = getContent(x => x.components.documentGuidance.availableImageExtensions);
  const fileTypesQuestion = getContent(x => x.components.documentGuidance.fileTypesQuestion);

  return (
    <>
      <ACC.Info summary={fileTypesQuestion}>
        <ACC.Renderers.SimpleString>{uploadGuidance}</ACC.Renderers.SimpleString>

        <ACC.UL>
          <li>{fileSizeGuidance}</li>
          <li>{fileNameGuidance}</li>
        </ACC.UL>

        <ACC.Renderers.SimpleString>{noFilesNumberLimitMessage}</ACC.Renderers.SimpleString>

        <ACC.Renderers.SimpleString>{fileTypesUploadMessage}</ACC.Renderers.SimpleString>

        <ACC.UL>
          <li>{pdf}</li>
          <li>{text}</li>
          <li>{presentation}</li>
          <li>{spreadsheet}</li>
          <li>{availableImageExtensions}</li>
        </ACC.UL>
      </ACC.Info>
    </>
  );
}

export type IDocumentMessages = (x: Content) => DocumentMessages;

interface DocumentGuidanceWithContentProps {
  documentMessages: IDocumentMessages;
}

export const DocumentGuidanceWithContent = (props: DocumentGuidanceWithContentProps) => {
  const stores = useStores();
  const { maxFileSize, permittedTypes } = stores.config.getConfig().options;

  return (
    <>
      <ACC.Content value={x => props.documentMessages(x).header(maxFileSize)} />
      <ACC.Info summary={<ACC.Content value={x => props.documentMessages(x).infoTitle} />}>
        <ACC.Content value={x => props.documentMessages(x).infoContent(permittedTypes)} />
      </ACC.Info>
    </>
  );
};
