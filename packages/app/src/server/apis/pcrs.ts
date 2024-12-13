import {
  CreatePcrDto,
  FullPCRItemDto,
  PCRDto,
  PcrRenamePartnerDto,
  PcrScopeChangeDto,
  PCRSummaryDto,
  StandalonePcrDto,
} from "@framework/dtos/pcrDtos";
import { contextProvider } from "@server/features/common/contextProvider";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import { UpdatePCRScopeChangeCommand } from "@server/features/pcrs/updatePcrScopeChangeCommand";
import { UpdatePCRRenamePartnerCommand } from "@server/features/pcrs/updatePcrRenamePartnerCommand";

export interface IPCRsApi<Context extends "client" | "server"> {
  create: (
    params: ApiParams<Context, { projectId: ProjectId; projectChangeRequestDto: CreatePcrDto }>,
  ) => Promise<PCRDto>;

  update: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        id: PcrId;
        pcr: PickRequiredFromPartial<Omit<PCRDto, "items">, "projectId" | "id"> & {
          items?: PickRequiredFromPartial<FullPCRItemDto, "id" | "type">[];
        };
      }
    >,
  ) => Promise<PCRDto>;

  updateScopeChange: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        id: PcrId;
        pcr: PcrScopeChangeDto;
      }
    >,
  ) => Promise<boolean>;

  renamePartner: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        id: PcrId;
        pcr: PcrRenamePartnerDto;
      }
    >,
  ) => Promise<boolean>;
  delete: (params: ApiParams<Context, { projectId: ProjectId; id: PcrId }>) => Promise<boolean>;
}

class Controller
  extends ControllerBaseWithSummary<"server", PCRSummaryDto, PCRDto | StandalonePcrDto>
  implements IPCRsApi<"server">
{
  constructor() {
    super("pcrs");

    this.postItem(
      "/:projectId",
      (p, _, b: PCRDto) => ({
        projectId: p.projectId,
        projectChangeRequestDto: processDto(b),
      }),
      this.create,
    );

    this.putItem(
      "/:projectId/:pcrId",
      (p, _, b: PCRDto) => ({ projectId: p.projectId, id: p.pcrId, pcr: processDto(b) }),
      this.update,
    );
    this.deleteItem("/:projectId/:pcrId", p => ({ projectId: p.projectId, id: p.pcrId }), this.delete);

    this.putItem(
      "/:projectId/:pcrId/scope-change",
      (p, _, b: PcrScopeChangeDto) => ({ projectId: p.projectId, id: p.pcrId, pcr: processDto(b) }),
      this.updateScopeChange,
    );

    this.putItem(
      "/:projectId/:pcrId/rename-partner",
      (p, _, b: PcrRenamePartnerDto) => ({ projectId: p.projectId, id: p.pcrId, pcr: processDto(b) }),
      this.renamePartner,
    );
    this.deleteItem("/:projectId/:pcrId", p => ({ projectId: p.projectId, id: p.pcrId }), this.delete);
  }

  async create(
    params: ApiParams<"server", { projectId: ProjectId; projectChangeRequestDto: CreatePcrDto }>,
  ): Promise<PCRDto> {
    const context = await contextProvider.start(params);

    const id = (await context.runCommand(
      new CreateProjectChangeRequestCommand(params.projectId, params.projectChangeRequestDto),
    )) as PcrId;

    return context.runQuery(new GetPCRByIdQuery(params.projectId, id));
  }

  async update(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        id: PcrId | PcrItemId;
        pcr: PickRequiredFromPartial<Omit<PCRDto, "items">, "projectId" | "id"> & {
          items?: PickRequiredFromPartial<FullPCRItemDto, "id" | "type">[];
        };
      }
    >,
  ): Promise<PCRDto> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePCRCommand({ projectId: params.projectId, projectChangeRequestId: params.id, pcr: params.pcr }),
    );
    return context.runQuery(new GetPCRByIdQuery(params.projectId, params.id));
  }

  async updateScopeChange(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        id: PcrId | PcrItemId;
        pcr: PcrScopeChangeDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePCRScopeChangeCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.id,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async renamePartner(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        id: PcrId | PcrItemId;
        pcr: PcrRenamePartnerDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePCRRenamePartnerCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.id,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async delete(params: ApiParams<"server", { projectId: ProjectId; id: PcrId }>): Promise<boolean> {
    const command = new DeleteProjectChangeRequestCommand(params.projectId, params.id);
    return (await contextProvider.start(params)).runCommand(command);
  }
}

export const controller = new Controller();
