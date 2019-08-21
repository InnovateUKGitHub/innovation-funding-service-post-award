import { PCR, PCRItemStatus, PCRStatus } from "@framework/entities/pcr";
import { range } from "@shared/range";
import { DateTime } from "luxon";
import { SalesforceInvalidFilterError } from "./errors";

export interface IPcrRepository {
  getAllByProjectId(projectId: string): Promise<PCR[]>;
  getById(id: string): Promise<PCR>;
}

const fakeData = range(10).map<PCR>(x => ({
  id: `PCR-${x}`,
  projectId: "ProjectID",
  number: x,
  comments: "",
  reasoningStatus: PCRItemStatus.Unknown,
  started: DateTime.local().setZone("").minus({days:x}).toJSDate(),
  status: PCRStatus.Unknown,
  updated: DateTime.local().setZone("").minus({days:x}).toJSDate()
}));

export class PCRRepository implements IPcrRepository {
  getAllByProjectId(projectId: string): Promise<PCR[]> {
    return Promise.resolve(fakeData.map(x => ({...x, projectId})));
  }

  getById(id: string): Promise<PCR> {
    const result = fakeData.find(x => x.id === id);
    if(!result) {
      throw new SalesforceInvalidFilterError("PCR NOT FOUND");
    }
    return Promise.resolve(result);
  }
}
