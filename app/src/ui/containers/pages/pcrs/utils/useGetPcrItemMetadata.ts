import { PCRItemType, pcrItemTypes } from "@framework/constants/pcrConstants";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { useContent } from "@ui/hooks/content.hook";

/**
 * Convert a Salesforce PCR name to an internationalized PCR name.
 */
export const useGetPcrItemMetadata = () => {
  const { getContent } = useContent();

  const getPcrItemMetadata = (value?: string | PCRItemType) => {
    return pcrItemTypes.find(x => x.type === value || x.typeName === value || x.displayName === value);
  };

  const getPcrItemContent = (
    value?: string | PCRItemType,
    pcr?: {
      organisationName?: FullPCRItemDto["organisationName"];
      accountName?: FullPCRItemDto["accountName"];
      partnerNameSnapshot?: FullPCRItemDto["partnerNameSnapshot"];
    },
  ) => {
    const foundPcrItem = getPcrItemMetadata(value);

    const name = foundPcrItem?.i18nName ? getContent(foundPcrItem.i18nName) : getContent(x => x.pcrTypes.unknown);
    const description = foundPcrItem?.i18nDescription ? getContent(foundPcrItem.i18nDescription) : undefined;

    let label = name;

    if (pcr) {
      if ("organisationName" in pcr && pcr.organisationName) {
        label += ` (${pcr.organisationName})`;
      } else if ("accountName" in pcr && pcr.accountName) {
        label += ` (${pcr.accountName})`;
      } else if ("partnerNameSnapshot" in pcr && pcr.partnerNameSnapshot) {
        label += ` (${pcr.partnerNameSnapshot})`;
      }
    }

    return {
      name,
      label,
      description,
    };
  };

  return { getPcrItemMetadata, getPcrItemContent };
};
