import contextProvider from "@server/features/common/contextProvider";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import { PCRDto, PCRItemTypeDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";

export interface IPCRsApi {
  getAll: (params: ApiParams<{ projectId: string }>) => Promise<PCRSummaryDto[]>;
}

class Controller extends ControllerBaseWithSummary<PCRSummaryDto, PCRDto> implements IPCRsApi {
  constructor() {
    super("pcrs");

    super.getItems("/", (p, q) => ({ projectId: q.projectId }), (p) => this.getAll(p));
    super.getItem("/:projectId/:id", (p, q) => ({ projectId: p.projectId, id: p.id }), (p) => this.get(p));
    super.getCustom("/types", () => ({}), p => this.getTypes(p));
  }

  getAll(params: ApiParams<{ projectId: string }>): Promise<PCRSummaryDto[]> {
    const query = new GetAllPCRsQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  get(params: ApiParams<{ projectId: string, id: string}>): Promise<PCRDto> {
    const query = new GetPCRByIdQuery(params.projectId, params.id);
    return contextProvider.start(params).runQuery(query);
  }

  getTypes(params: ApiParams<{}>): Promise<PCRItemTypeDto[]> {
    const query = new GetPCRItemTypesQuery();
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
