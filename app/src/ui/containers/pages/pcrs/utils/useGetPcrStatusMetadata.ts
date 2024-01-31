import { IPcrStatusMetaValue, PCRStatus, pcrStatusMetaValues } from "@framework/constants/pcrConstants";
import { useContent } from "@ui/hooks/content.hook";

const useGetPcrStatusMetadata = () => {
  const { getContent } = useContent();

  const getPcrStatusMetadata = (status: PCRStatus): IPcrStatusMetaValue | undefined => {
    const metadata = pcrStatusMetaValues.find(x => x.status === status);

    return metadata;
  };
  const getPcrInternalStatusName = (status: PCRStatus): string => {
    const metadata = getPcrStatusMetadata(status);
    if (metadata?.i18nInternalName) return getContent(metadata?.i18nInternalName);
    if (metadata?.i18nName) return getContent(metadata?.i18nName);
    return "";
  };
  const getPcrStatusName = (status: PCRStatus): string => {
    const metadata = getPcrStatusMetadata(status);
    if (metadata?.i18nName) return getContent(metadata?.i18nName);
    return "";
  };

  return { getPcrStatusMetadata, getPcrStatusName, getPcrInternalStatusName };
};

export { useGetPcrStatusMetadata };
