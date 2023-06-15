import { contextProvider } from "@server/features/common/contextProvider";
import {
  PCRDto,
  PCRItemTypeDto,
  PCRSummaryDto,
  PCRTimeExtensionOption,
  ProjectChangeRequestStatusChangeDto,
} from "@framework/dtos/pcrDtos";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { processDto } from "@shared/processResponse";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { GetProjectChangeRequestStatusChanges } from "@server/features/pcrs/getProjectChangeRequestStatusChanges";
import {
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole,
  PCRSpendProfileCapitalUsageType,
  PCRSpendProfileOverheadRate,
} from "@framework/constants";
import { GetPcrProjectRolesQuery } from "@server/features/pcrs/getPcrProjectRolesQuery";
import { Option } from "@framework/dtos";
import { GetPcrPartnerTypesQuery } from "@server/features/pcrs/getPcrPartnerTypesQuery";
import { GetPcrParticipantSizesQuery } from "@server/features/pcrs/getPcrParticipantSizesQuery";
import { GetPcrProjectLocationsQuery } from "@server/features/pcrs/getPcrProjectLocationsQuery";
import { GetAvailableItemTypesQuery } from "@server/features/pcrs/getAvailableItemTypesQuery";
import { GetPcrSpendProfileCapitalUsageTypesQuery } from "@server/features/pcrs/getPcrSpendProfileCapitalUsageTypesQuery";
import { GetPcrSpendProfileOverheadRateOptionsQuery } from "@server/features/pcrs/getPcrSpendProfileOverheadRateOptionsQuery";
import { GetTimeExtensionOptionsQuery } from "@server/features/pcrs/getTimeExtensionOptionsQuery";

import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";

export interface IPCRsApi {
  create: (params: ApiParams<{ projectId: ProjectId; projectChangeRequestDto: PCRDto }>) => Promise<PCRDto>;
  getAll: (params: ApiParams<{ projectId: ProjectId }>) => Promise<PCRSummaryDto[]>;
  get: (params: ApiParams<{ projectId: ProjectId; id: PcrId }>) => Promise<PCRDto>;
  getTypes: (params: ApiParams<{ projectId: ProjectId }>) => Promise<PCRItemTypeDto[]>;
  getAvailableTypes: (params: ApiParams<{ projectId: ProjectId; pcrId?: PcrId }>) => Promise<PCRItemTypeDto[]>;
  getTimeExtensionOptions: (params: ApiParams<{ projectId: ProjectId }>) => Promise<PCRTimeExtensionOption[]>;
  update: (params: ApiParams<{ projectId: ProjectId; id: PcrId; pcr: PCRDto }>) => Promise<PCRDto>;
  delete: (params: ApiParams<{ projectId: ProjectId; id: PcrId }>) => Promise<boolean>;
  getStatusChanges: (
    params: ApiParams<{ projectId: ProjectId; projectChangeRequestId: PcrId }>,
  ) => Promise<ProjectChangeRequestStatusChangeDto[]>;
  getPcrProjectRoles: (params: ApiParams) => Promise<Option<PCRProjectRole>[]>;
  getPcrPartnerTypes: (params: ApiParams) => Promise<Option<PCRPartnerType>[]>;
  getParticipantSizes: (params: ApiParams) => Promise<Option<PCRParticipantSize>[]>;
  getProjectLocations: (params: ApiParams) => Promise<Option<PCRProjectLocation>[]>;
  getCapitalUsageTypes: (params: ApiParams) => Promise<Option<PCRSpendProfileCapitalUsageType>[]>;
  getOverheadRateOptions: (params: ApiParams) => Promise<Option<PCRSpendProfileOverheadRate>[]>;
}

class Controller extends ControllerBaseWithSummary<PCRSummaryDto, PCRDto> implements IPCRsApi {
  constructor() {
    super("pcrs");

    this.getItems("/", (_, q) => ({ projectId: q.projectId }), this.getAll);

    this.getCustom("/all-types/:projectId", p => ({ projectId: p.projectId }), this.getTypes);
    this.getCustom("/available-types", (_, q) => ({ projectId: q.projectId, pcrId: q.pcrId }), this.getAvailableTypes);
    this.getCustom("/time-extension-options", (_, q) => ({ projectId: q.projectId }), this.getTimeExtensionOptions);

    this.getCustom(
      "/status-changes/:projectId/:projectChangeRequestId",
      p => ({ projectId: p.projectId, projectChangeRequestId: p.projectChangeRequestId as PcrId }),
      this.getStatusChanges,
    );
    this.getCustom("/project-roles", () => ({}), this.getPcrProjectRoles);
    this.getCustom("/partner-types", () => ({}), this.getPcrPartnerTypes);
    this.getCustom("/participant-sizes", () => ({}), this.getParticipantSizes);
    this.getCustom("/project-locations", () => ({}), this.getProjectLocations);
    this.getCustom("/capital-usage-types", () => ({}), this.getCapitalUsageTypes);
    this.getCustom("/overhead-rate-options", () => ({}), this.getOverheadRateOptions);

    this.getItem("/:projectId/:pcrId", p => ({ projectId: p.projectId, id: p.pcrId }), this.get);

    this.postItem(
      "/:projectId",
      (p, _, b: PCRDto) => ({ projectId: p.projectId, projectChangeRequestDto: processDto(b) }),
      this.create,
    );

    this.putItem(
      "/:projectId/:pcrId",
      (p, _, b: PCRDto) => ({ projectId: p.projectId, id: p.pcrId, pcr: processDto(b) }),
      this.update,
    );

    this.deleteItem("/:projectId/:pcrId", p => ({ projectId: p.projectId, id: p.pcrId }), this.delete);
  }

  getAll(params: ApiParams<{ projectId: ProjectId }>): Promise<PCRSummaryDto[]> {
    const query = new GetAllPCRsQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  get(params: ApiParams<{ projectId: ProjectId; id: PcrId }>): Promise<PCRDto> {
    const query = new GetPCRByIdQuery(params.projectId, params.id);
    return contextProvider.start(params).runQuery(query);
  }

  async create(params: ApiParams<{ projectId: ProjectId; projectChangeRequestDto: PCRDto }>): Promise<PCRDto> {
    const context = contextProvider.start(params);
    const id = (await context.runCommand(
      new CreateProjectChangeRequestCommand(params.projectId, params.projectChangeRequestDto),
    )) as PcrId;
    return context.runQuery(new GetPCRByIdQuery(params.projectId, id));
  }

  public getTypes(params: ApiParams<{ projectId: ProjectId }>): Promise<PCRItemTypeDto[]> {
    const query = new GetPCRItemTypesQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  getAvailableTypes(params: ApiParams<{ projectId: ProjectId; pcrId?: PcrId }>): Promise<PCRItemTypeDto[]> {
    const query = new GetAvailableItemTypesQuery(params.projectId, params.pcrId);
    return contextProvider.start(params).runQuery(query);
  }

  public getTimeExtensionOptions(params: ApiParams<{ projectId: ProjectId }>): Promise<PCRTimeExtensionOption[]> {
    const query = new GetTimeExtensionOptionsQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  async update(params: ApiParams<{ projectId: ProjectId; id: PcrId; pcr: PCRDto }>): Promise<PCRDto> {
    const context = contextProvider.start(params);
    await context.runCommand(
      new UpdatePCRCommand({ projectId: params.projectId, projectChangeRequestId: params.id, pcr: params.pcr }),
    );
    return context.runQuery(new GetPCRByIdQuery(params.projectId, params.id));
  }

  delete(params: ApiParams<{ projectId: ProjectId; id: PcrId }>): Promise<boolean> {
    const command = new DeleteProjectChangeRequestCommand(params.projectId, params.id);
    return contextProvider.start(params).runCommand(command);
  }

  public getStatusChanges(params: ApiParams<{ projectId: ProjectId; projectChangeRequestId: PcrId }>) {
    const query = new GetProjectChangeRequestStatusChanges(params.projectId, params.projectChangeRequestId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getPcrProjectRoles(params: ApiParams) {
    const query = new GetPcrProjectRolesQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getPcrPartnerTypes(params: ApiParams) {
    const query = new GetPcrPartnerTypesQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getParticipantSizes(params: ApiParams) {
    const query = new GetPcrParticipantSizesQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectLocations(params: ApiParams) {
    const query = new GetPcrProjectLocationsQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getCapitalUsageTypes(params: ApiParams) {
    const query = new GetPcrSpendProfileCapitalUsageTypesQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getOverheadRateOptions(params: ApiParams) {
    const query = new GetPcrSpendProfileOverheadRateOptionsQuery();
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
