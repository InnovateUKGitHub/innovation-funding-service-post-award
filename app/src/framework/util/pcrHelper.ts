import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";

export const mergePcrData = <T extends Pick<PCRDto, "id"> & { items?: Pick<PCRItemDto, "id">[] }>(
  pcr: T,
  mergeIntoPcr: PCRDto,
) => {
  return {
    ...Object.assign({}, mergeIntoPcr, pcr),
    items: Array.isArray(pcr?.items)
      ? pcr.items.map(item => Object.assign({}, mergeIntoPcr?.items?.find(x => x.id === item.id) ?? {}, item))
      : pcr?.items,
  };
};
