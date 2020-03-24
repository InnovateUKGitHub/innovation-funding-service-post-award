// tslint:disable:no-duplicate-string
import contextProvider from "@server/features/common/contextProvider";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import { PCRDto, PCRItemTypeDto, PCRSummaryDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { processDto } from "@shared/processResponse";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { GetProjectChangeRequestStatusChanges } from "@server/features/pcrs/getProjectChangeRequestStatusChanges";
import { PCRParticipantSize, PCRPartnerType, PCRProjectRole } from "@framework/constants";
import { GetPcrProjectRolesQuery } from "@server/features/pcrs/getPcrProjectRolesQuery";
import { Option } from "@framework/dtos";
import { GetPcrPartnerTypesQuery } from "@server/features/pcrs/getPcrPartnerTypesQuery";
import { GetPcrParticipantSizesQuery } from "@server/features/pcrs/getPcrParticipantSizesQuery";

export interface IPCRsApi {
  create: (params: ApiParams<{ projectId: string, projectChangeRequestDto: PCRDto }>) => Promise<PCRDto>;
  getAll: (params: ApiParams<{ projectId: string }>) => Promise<PCRSummaryDto[]>;
  get: (params: ApiParams<{ projectId: string, id: string }>) => Promise<PCRDto>;
  getTypes: (params: ApiParams<{}>) => Promise<PCRItemTypeDto[]>;
  update: (params: ApiParams<{projectId: string; id: string; pcr: PCRDto;}>) => Promise<PCRDto>;
  delete: (params: ApiParams<{projectId: string; id: string; }>) => Promise<boolean>;
  getStatusChanges: (params: ApiParams<{projectId: string, projectChangeRequestId: string }>) => Promise<ProjectChangeRequestStatusChangeDto[]>;
  getPcrProjectRoles: (params: ApiParams<{}>) => Promise<Option<PCRProjectRole>[]>;
  getPcrPartnerTypes: (params: ApiParams<{}>) => Promise<Option<PCRPartnerType>[]>;
  getParticipantSizes: (params: ApiParams<{}>) => Promise<Option<PCRParticipantSize>[]>;
}

class Controller extends ControllerBaseWithSummary<PCRSummaryDto, PCRDto> implements IPCRsApi {
  constructor() {
    super("pcrs");

    super.getItems("/", (p, q) => ({ projectId: q.projectId }), (p) => this.getAll(p));
    super.getItem("/:projectId/:id", (p, q) => ({ projectId: p.projectId, id: p.id }), (p) => this.get(p));
    super.postItem("/:projectId", (p, q, b) => ({ projectId: p.projectId, projectChangeRequestDto: processDto(b) }), (p) => this.create(p));
    super.getCustom("/types", () => ({}), p => this.getTypes(p));
    super.putItem("/:projectId/:id", (p, q, b) => ({ projectId: p.projectId, id: p.id, pcr: processDto(b) }), (p) => this.update(p));
    super.deleteItem("/:projectId/:id", (p, q) => ({ projectId: p.projectId, id: p.id }), (p) => this.delete(p));
    this.getCustom("/status-changes/:projectId/:projectChangeRequestId", (p) => ({projectId: p.projectId, projectChangeRequestId: p.projectChangeRequestId}), p => this.getStatusChanges(p));
    this.getCustom("/project-roles", () => ({}), (p) => this.getPcrProjectRoles(p));
    this.getCustom("/partner-types", () => ({}), (p) => this.getPcrPartnerTypes(p));
    this.getCustom("/participant-sizes", () => ({}), (p) => this.getParticipantSizes(p));
  }

  getAll(params: ApiParams<{ projectId: string }>): Promise<PCRSummaryDto[]> {
    const query = new GetAllPCRsQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  get(params: ApiParams<{ projectId: string, id: string }>): Promise<PCRDto> {
    const query = new GetPCRByIdQuery(params.projectId, params.id);
    return contextProvider.start(params).runQuery(query);
  }

  async create(params: ApiParams<{ projectId: string, projectChangeRequestDto: PCRDto}>): Promise<PCRDto> {
    const context = contextProvider.start(params);
    const id = await context.runCommand(new CreateProjectChangeRequestCommand(params.projectId, params.projectChangeRequestDto));
    return context.runQuery(new GetPCRByIdQuery(params.projectId, id));
  }

  getTypes(params: ApiParams<{}>): Promise<PCRItemTypeDto[]> {
    const query = new GetPCRItemTypesQuery();
    return contextProvider.start(params).runQuery(query);
  }

  async update(params: ApiParams<{ projectId: string; id: string; pcr: PCRDto; }>): Promise<PCRDto> {
    const context = contextProvider.start(params);
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.id, params.pcr));
    return context.runQuery(new GetPCRByIdQuery(params.projectId, params.id));
  }

  delete(params: ApiParams<{ projectId: string, id: string }>): Promise<boolean> {
    const command = new DeleteProjectChangeRequestCommand(params.projectId, params.id);
    return contextProvider.start(params).runCommand(command);
  }

  public getStatusChanges(params: ApiParams<{ projectId: string, projectChangeRequestId: string }>) {
    const query = new GetProjectChangeRequestStatusChanges(params.projectId, params.projectChangeRequestId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getPcrProjectRoles(params: ApiParams<{}>) {
    const query = new GetPcrProjectRolesQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getPcrPartnerTypes(params: ApiParams<{}>) {
    const query = new GetPcrPartnerTypesQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getParticipantSizes(params: ApiParams<{}>) {
    const query = new GetPcrParticipantSizesQuery();
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
