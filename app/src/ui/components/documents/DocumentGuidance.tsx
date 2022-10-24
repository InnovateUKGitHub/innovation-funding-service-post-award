import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import bytes from "bytes";

export function DocumentGuidance() {
  const { getContent } = useContent();
  const stores = useStores();
  const { maxFileSize } = stores.config.getConfig().options;

  const uploadGuidance = getContent(x => x.components.documentGuidance.uploadGuidance);
  const fileSizeGuidance = getContent(x => x.components.documentGuidance.fileSize({ maxFileSize: bytes(maxFileSize) }));
  const fileNameGuidance = getContent(x => x.components.documentGuidance.uniqueFileName);
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
