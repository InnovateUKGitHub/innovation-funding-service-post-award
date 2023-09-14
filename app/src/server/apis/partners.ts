import { processDto } from "@shared/processResponse";
import { contextProvider } from "@server/features/common/contextProvider";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { GetAllQuery } from "@server/features/partners/getAllQuery";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";

export interface IPartnersApi<Context extends "client" | "server"> {
  getAll: (params: ApiParams<Context>) => Promise<PartnerDto[]>;
  getAllByProjectId: (params: ApiParams<Context, { projectId: ProjectId }>) => Promise<PartnerDto[]>;
  get: (params: ApiParams<Context, { partnerId: PartnerId }>) => Promise<PartnerDto>;
  updatePartner: (
    params: ApiParams<
      Context,
      {
        partnerId: PartnerId;
        partnerDto: PickRequiredFromPartial<PartnerDto, "id" | "projectId">;
        validateBankDetails?: boolean;
        verifyBankDetails?: boolean;
      }
    >,
  ) => Promise<PartnerDto>;
}

class Controller extends ControllerBase<"server", PartnerDto> implements IPartnersApi<"server"> {
  constructor() {
    super("partners");

    this.getItems<{ projectId: ProjectId }>(
      "/",
      (p, q) => ({ projectId: q.projectId }),
      p => (p.projectId ? this.getAllByProjectId(p) : this.getAll(p)),
    );
    this.getItem(
      "/:partnerId",
      p => ({ partnerId: p.partnerId }),
      p => this.get(p),
    );
    this.putItem(
      "/:partnerId",
      (p, q, b: PartnerDto) => ({
        partnerId: p.partnerId,
        partnerDto: processDto(b),
        validateBankDetails: q.validateBankDetails === "true",
        verifyBankDetails: q.verifyBankDetails === "true",
      }),
      p => this.updatePartner(p),
    );
  }

  public async getAll(params: ApiParams<"server">) {
    const query = new GetAllQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllByProjectId(params: ApiParams<"server", { projectId: ProjectId }>) {
    const { projectId } = params;
    const query = new GetAllForProjectQuery(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<"server", { partnerId: PartnerId }>) {
    const { partnerId } = params;
    const query = new GetByIdQuery(partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async updatePartner(
    params: ApiParams<
      "server",
      {
        partnerId: PartnerId;
        partnerDto: PickRequiredFromPartial<PartnerDto, "id" | "projectId">;
        validateBankDetails?: boolean;
        verifyBankDetails?: boolean;
      }
    >,
  ) {
    const context = contextProvider.start(params);
    await context.runCommand(
      new UpdatePartnerCommand(params.partnerDto as PartnerDto, params.validateBankDetails, params.verifyBankDetails),
    );

    const query = new GetByIdQuery(params.partnerId);
    return context.runQuery(query);
  }
}

export const controller = new Controller();
