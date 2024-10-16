import { useContent } from "@ui/hooks/content.hook";
import { Content } from "../../../molecules/Content/content";
import { Info } from "@ui/components/atoms/Details/Details";
import { useClientConfig } from "@ui/context/ClientConfigProvider";

/**
 * A "Document Guidance" details pane, which describes what a user can/is allowed to upload.
 *
 * @returns Document Guidance component
 */
const DocumentGuidance = () => {
  const { getContent } = useContent();
  const config = useClientConfig();

  return (
    <Info summary={getContent(x => x.components.documentGuidance.header)}>
      <Content
        markdown
        value={x =>
          x.components.documentGuidance.message({
            documentCount: config.options.maxUploadFileCount,
            size: config.options.maxFileSize,
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
