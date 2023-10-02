import { PCRStatus, pcrStatusMetaValues } from "@framework/constants/pcrConstants";
import { useContent } from "@ui/hooks/content.hook";

const useGetPcrStatusName = () => {
  const { getContent } = useContent();

  return {
    getPcrStatusName: (status: PCRStatus): string => {
      const contentSelector = pcrStatusMetaValues.find(x => x.status === status)?.i18nName;

      if (contentSelector) return getContent(contentSelector);
      return "";
    },
  };
};

export { useGetPcrStatusName };
