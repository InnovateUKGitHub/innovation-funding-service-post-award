import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";

export const mergePcrData = <T extends Pick<PCRDto, "id"> & { items?: Pick<PCRItemDto, "id">[] }>(
  newPcr: T,
  existingPcr: PCRDto,
) => {
  // Collect a list of PCR items, as well as already seen PCR Item IDs
  const items = [];
  const ids = new Set<string>();

  // Add all our new items into the array
  for (const item of existingPcr.items) {
    items.push(item);
    ids.add(item.id);
  }

  if (newPcr.items) {
    for (const item of newPcr.items) {
      // If we've not seen the ID before, or if it has no ID, add to our items list
      if (item.id === undefined || !ids.has(item.id)) {
        items.push(item);
      }

      // If we have seen the ID before, merge it in.
      const existingItem = items.find(
        x => typeof x.id !== "undefined" && typeof item.id !== "undefined" && x.id === item.id,
      );
      if (existingItem) {
        Object.assign(existingItem, item);
      }
    }
  }

  return {
    ...existingPcr,
    ...newPcr,
    items,
  };
};
