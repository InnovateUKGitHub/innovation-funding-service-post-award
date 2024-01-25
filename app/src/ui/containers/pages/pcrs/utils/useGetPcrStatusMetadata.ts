import { IPcrStatusMetaValue, PCRStatus, pcrStatusMetaValues } from "@framework/constants/pcrConstants";
import { useContent } from "@ui/hooks/content.hook";

const useGetPcrStatusMetadata = () => {
  const { getContent } = useContent();

  return {
    getPcrMetadata: (status: PCRStatus): IPcrStatusMetaValue | undefined => {
      const metadata = pcrStatusMetaValues.find(x => x.status === status);

      return metadata;
    },
    getPcrStatusName: (status: PCRStatus): string => {
      const contentSelector = pcrStatusMetaValues.find(x => x.status === status)?.i18nName;

      if (contentSelector) return getContent(contentSelector);
      return "";
    },
  };
};

export { useGetPcrStatusMetadata };
