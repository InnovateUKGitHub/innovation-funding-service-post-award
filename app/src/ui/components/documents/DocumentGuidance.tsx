import { useClientOptionsQuery } from "@gql/hooks/useSiteOptionsQuery";
import { Content, Info } from "@ui/components";
import { useContent } from "@ui/hooks";
import bytes from "bytes";

/**
 * A "Document Guidance" details pane, which describes what a user can/is allowed to upload.
 *
 * @returns Document Guidance component
 */
const DocumentGuidance = () => {
  const { getContent } = useContent();
  const { data } = useClientOptionsQuery();

  return (
    <Info summary={getContent(x => x.components.documentGuidance.header)}>
      <Content
        markdown
        value={x =>
          x.components.documentGuidance.message({
            documentCount: data.clientConfig.options.maxUploadFileCount,
            maxFileSize: bytes(data.clientConfig.options.maxFileSize),
            documentFormats: data.clientConfig.options.permittedTypes.pdfTypes,
            textFormats: data.clientConfig.options.permittedTypes.textTypes,
            presentationFormats: data.clientConfig.options.permittedTypes.presentationTypes,
            spreadsheetFormats: data.clientConfig.options.permittedTypes.spreadsheetTypes,
            imageFormats: data.clientConfig.options.permittedTypes.imageTypes,
          })
        }
      />
    </Info>
  );
};

export { DocumentGuidance };
