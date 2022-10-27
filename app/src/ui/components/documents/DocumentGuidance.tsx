import { Info, Content } from "@ui/components";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import bytes from "bytes";

/**
 * A "Document Guidance" details pane, which describes what a user can/is allowed to upload.
 *
 * @returns Document Guidance component
 */
const DocumentGuidance = () => {
  const { getContent } = useContent();
  const stores = useStores();
  const { maxFileSize } = stores.config.getConfig().options;

  return (
    <Info summary={getContent(x => x.components.documentGuidance.header)}>
      <Content markdown value={x => x.components.documentGuidance.message({ maxFileSize: bytes(maxFileSize) })} />
    </Info>
  );
};

export { DocumentGuidance };
