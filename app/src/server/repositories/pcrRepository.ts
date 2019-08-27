import { PCR, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/entities/pcr";
import { range } from "@shared/range";
import { DateTime } from "luxon";
import { SalesforceInvalidFilterError } from "./errors";

export interface IPcrRepository {
  getAllByProjectId(projectId: string): Promise<PCR[]>;
  getById(projectId: string, id: string): Promise<PCR>;
}

const fakeItemTypes = ["Scope", "Duration", "Cost", "Partner"];
const fakePcrStatus = ["Approved", "Draft", "Submitted to MO", "Queried", "Submitted to IUK"];

const fakeData = range(10).map<PCR>(x => ({
  id: `PCR-${x}`,
  projectId: "ProjectID",
  number: x,
  comments: "",
  reasoningStatus: PCRItemStatus.Unknown,
  started: DateTime.local().setZone("Europe/London").startOf("day").minus({ days: x }).toJSDate(),
  status: (x % fakePcrStatus.length) + 1 as PCRStatus,
  statusName: fakePcrStatus[(x) % fakePcrStatus.length],
  updated: DateTime.local().setZone("Europe/London").startOf("day").minus({ days: x }).toJSDate(),
  reasoning: "",
  reasoningStatusName: fakePcrStatus[(x + 1) % fakePcrStatus.length],
  items: fakeItemTypes.map((type, i) => ({ itemType: i + 1 as PCRItemType, itemTypeName: type }))
}));

export class PCRRepository implements IPcrRepository {
  getAllByProjectId(projectId: string): Promise<PCR[]> {
    return Promise.resolve(fakeData.map(x => ({ ...x, projectId })));
  }

  getById(projectId: string, id: string): Promise<PCR> {
    const result = fakeData.find(x => x.id === id);
    if (!result) {
      throw new SalesforceInvalidFilterError("PCR NOT FOUND");
    }
    return Promise.resolve(result);
  }
}
