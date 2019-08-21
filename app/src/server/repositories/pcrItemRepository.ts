import { PCRItem, PCRItemStatus, PCRItemType } from "@framework/entities/pcr";
import { range } from "@shared/range";
import { DateTime } from "luxon";
import { SalesforceInvalidFilterError } from "./errors";

export interface IPcrItemRepository {
  getAllByPcrId(pcrId: string): Promise<PCRItem[]>;
  getById(id: string): Promise<PCRItem>;
}

const fakeData = range(10).map<PCRItem>(x => ({
  id: `PCR-Item-${x}`,
  pcrId: "PCRID",
  itemType: PCRItemType.Unknown,
  status: PCRItemStatus.Unknown,
}));

export class PCRItemRepository implements IPcrItemRepository {
  getAllByPcrId(pcrId: string): Promise<PCRItem[]> {
    return Promise.resolve(fakeData.map(x => ({...x, pcrId})));
  }

  getById(id: string): Promise<PCRItem> {
    const result = fakeData.find(x => x.id === id);
    if(!result) {
      throw new SalesforceInvalidFilterError("PCR NOT FOUND");
    }
    return Promise.resolve(result);
  }
}
