import {
  CreatePcrDto,
  FullPCRItemDto,
  PCRDto,
  PcrRemovePartnerDto,
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
import { UpdatePcrScopeChangeCommand } from "@server/features/pcrs/updatePcrScopeChangeCommand";
import { UpdatePcrRenamePartnerCommand } from "@server/features/pcrs/updatePcrRenamePartnerCommand";
import { UpdatePcrRemovePartnerCommand } from "@server/features/pcrs/updatePcrRemovePartnerCommand";

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

  scopeChange: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrScopeChangeDto;
      }
    >,
  ) => Promise<boolean>;

  renamePartner: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrRenamePartnerDto;
      }
    >,
  ) => Promise<boolean>;

  removePartner: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrRemovePartnerDto;
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
      "/:projectId/:pcrId/:pcrItemId/scope-change",
      (p, _, b: PcrScopeChangeDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.scopeChange,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/rename-partner",
      (p, _, b: PcrRenamePartnerDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.renamePartner,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/remove-partner",
      (p, _, b: PcrRemovePartnerDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.removePartner,
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

  async scopeChange(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrScopeChangeDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrScopeChangeCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
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
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrRenamePartnerDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrRenamePartnerCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async removePartner(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrRemovePartnerDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrRemovePartnerCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
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
