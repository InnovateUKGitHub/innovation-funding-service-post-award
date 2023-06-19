import { useContent } from "@ui/hooks/content.hook";
import { useStores } from "@ui/redux/storesProvider";
import bytes from "bytes";
import { Content } from "../content";
import { Info } from "../layout/info";

/**
 * A "Document Guidance" details pane, which describes what a user can/is allowed to upload.
 *
 * @returns Document Guidance component
 */
const DocumentGuidance = () => {
  const { getContent } = useContent();
  const stores = useStores();
  const config = stores.config.getConfig();

  return (
    <Info summary={getContent(x => x.components.documentGuidance.header)}>
      <Content
        markdown
        value={x =>
          x.components.documentGuidance.message({
            documentCount: config.options.maxUploadFileCount,
            maxFileSize: bytes(config.options.maxFileSize),
            documentFormats: config.options.permittedTypes.pdfTypes,
            textFormats: config.options.permittedTypes.textTypes,
            presentationFormats: config.options.permittedTypes.presentationTypes,
            spreadsheetFormats: config.options.permittedTypes.spreadsheetTypes,
            imageFormats: config.options.permittedTypes.imageTypes,
          })
        }
      />
    </Info>
  );
};

export { DocumentGuidance };
