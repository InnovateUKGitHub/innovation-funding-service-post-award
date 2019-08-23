import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import { PCRDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import contextProvider from "@server/features/common/contextProvider";

export interface IPCRsApi {
  getAll: (params: ApiParams<{ projectId: string }>) => Promise<PCRSummaryDto[]>;
}

class Controller extends ControllerBaseWithSummary<PCRSummaryDto, PCRDto> implements IPCRsApi {
  constructor() {
    super("pcrs");

    super.getItems("/", (p, q) => ({ projectId: q.projectId }), (p) => this.getAll(p));
  }

  getAll(params: ApiParams<{ projectId: string }>): Promise<PCRSummaryDto[]> {
    const query = new GetAllPCRsQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
