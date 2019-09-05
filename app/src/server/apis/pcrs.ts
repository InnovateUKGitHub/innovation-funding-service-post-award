import contextProvider from "@server/features/common/contextProvider";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import { PCRDto, PCRItemDto, PCRItemTypeDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { processDto } from "@shared/processResponse";
import { PCRItemStatus, PCRStatus } from "@framework/entities";

export interface IPCRsApi {
  create: (params: ApiParams<{ projectId: string, projectChangeRequestDto: PCRDto }>) => Promise<PCRDto>;
  getAll: (params: ApiParams<{ projectId: string }>) => Promise<PCRSummaryDto[]>;
  get: (params: ApiParams<{ projectId: string, id: string }>) => Promise<PCRDto>;
  getTypes: (params: ApiParams<{ }>) => Promise<PCRItemTypeDto[]>;
}

class Controller extends ControllerBaseWithSummary<PCRSummaryDto, PCRDto> implements IPCRsApi {
  constructor() {
    super("pcrs");

    super.getItems("/", (p, q) => ({ projectId: q.projectId }), (p) => this.getAll(p));
    super.getItem("/:projectId/:id", (p, q) => ({ projectId: p.projectId, id: p.id }), (p) => this.get(p));
    super.postItem("/:projectId", (p, q, b) => ({ projectId: q.projectId, projectChangeRequestDto: processDto(b) }), (p) => this.create(p));
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

  create({projectId, projectChangeRequestDto}: ApiParams<{ projectId: string, projectChangeRequestDto: PCRDto}>): Promise<PCRDto> {
    // TODO write command
    return Promise.resolve({...projectChangeRequestDto, id: "1"});
  }

  getTypes(params: ApiParams<{}>): Promise<PCRItemTypeDto[]> {
    const query = new GetPCRItemTypesQuery();
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
