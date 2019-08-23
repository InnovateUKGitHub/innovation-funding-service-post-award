import { PCRItem, PCRItemStatus, PCRItemType } from "@framework/entities/pcr";
import { range } from "@shared/range";
import { DateTime } from "luxon";
import { SalesforceInvalidFilterError } from "./errors";

export interface IPcrItemRepository {
  getAllItemsByPcrId(pcrId: string): Promise<PCRItem[]>;
  getItemById(id: string): Promise<PCRItem>;
}

const fakeData = range(10).map<PCRItem>(x => ({
  id: `PCR-Item-${x}`,
  pcrId: "PCRID",
  itemType: PCRItemType.Unknown,
  itemTypeName: "Unknown",
  status: PCRItemStatus.Unknown,
  statusName: "Unknown",
}));

export class PCRItemRepository implements IPcrItemRepository {
  getAllItemsByPcrId(pcrId: string): Promise<PCRItem[]> {
    return Promise.resolve(fakeData.map(x => ({...x, pcrId})));
  }

  getItemById(id: string): Promise<PCRItem> {
    const result = fakeData.find(x => x.id === id);
    if(!result) {
      throw new SalesforceInvalidFilterError("PCR NOT FOUND");
    }
    return Promise.resolve(result);
  }
}
