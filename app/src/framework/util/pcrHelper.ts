import { PCRItemType } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { PcrSpendProfileDto } from "@framework/dtos/pcrSpendProfileDto";
import { omit } from "lodash";

type AddPartnerItem = { id: PcrItemId; type: PCRItemType.PartnerAddition; spendProfile: PcrSpendProfileDto };
type Item = { id: PcrItemId; type: PCRItemType };

type MinimalPcrType = Pick<PCRDto, "id"> & {
  items?: (Item | AddPartnerItem)[];
};

const isAddPartnerItem = (item: Item | AddPartnerItem): item is AddPartnerItem =>
  item.type === PCRItemType.PartnerAddition;

const hasSpendProfile = (item: AddPartnerItem) => !!item?.spendProfile;

export const mergePcrData = <T extends MinimalPcrType>(newPcr: T, existingPcr: PCRDto) => {
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
      const existingItem = items.find(x => x.id === item.id);

      if (existingItem) {
        if (isAddPartnerItem(existingItem) && isAddPartnerItem(item) && hasSpendProfile(item)) {
          const costs = [];

          // if we need to merge spend profiles
          const existingCostIds = new Set<string>();

          // merge in costs
          for (const existingCost of existingItem.spendProfile.costs) {
            existingCostIds.add(existingCost.id);
            const matchingCost = item.spendProfile.costs.find(x => x.id === existingCost.id);

            if (matchingCost) {
              costs.push(Object.assign(existingCost, matchingCost));
            } else {
              costs.push(existingCost);
            }
          }

          for (const newCost of item.spendProfile.costs) {
            if (!existingCostIds.has(newCost.id)) {
              costs.push(newCost);
            }
          }

          // merge in funds if necessary, simply replacing current with new,
          // but this requires the presence of an `editPcrFunds` flag.
          // reason for the flag is that funds can be deleted in their entirety.
          // sometimes an empty array for funds can mean no change required and sometimes
          // an empty array will mean that all the funds have been deleted.
          // the flag which must be added to the pcrItem dto is used to say if the existing funds
          // must be changed. This will need to be added to any page where funds are being edited
          // e.g. "other sources of funding" page
          let funds = existingItem.spendProfile.funds;

          if (item.spendProfile.editPcrFunds) {
            funds = item.spendProfile.funds;
          }

          const updatedSpendProfile = {
            spendProfile: { ...existingItem.spendProfile, ...item.spendProfile, costs, funds },
          };

          Object.assign(existingItem, omit(item, "spendProfile"), updatedSpendProfile);
        } else {
          Object.assign(existingItem, item);
        }
      }
    }
  }

  return {
    ...existingPcr,
    ...newPcr,
    items,
  };
};
