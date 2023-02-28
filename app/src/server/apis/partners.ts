import { PartnerDto } from "@framework/types";
import { processDto } from "@shared/processResponse";
import { contextProvider } from "@server/features/common/contextProvider";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { GetAllForProjectQuery, GetAllQuery, GetByIdQuery } from "../features/partners";

export interface IPartnersApi {
  getAll: (params: ApiParams) => Promise<PartnerDto[]>;
  getAllByProjectId: (params: ApiParams<{ projectId: ProjectId }>) => Promise<PartnerDto[]>;
  get: (params: ApiParams<{ partnerId: PartnerId }>) => Promise<PartnerDto>;
  updatePartner: (
    params: ApiParams<{
      partnerId: PartnerId;
      partnerDto: PartnerDto;
      validateBankDetails?: boolean;
      verifyBankDetails?: boolean;
    }>,
  ) => Promise<PartnerDto>;
}

class Controller extends ControllerBase<PartnerDto> implements IPartnersApi {
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

  public async getAll(params: ApiParams) {
    const query = new GetAllQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllByProjectId(params: ApiParams<{ projectId: ProjectId }>) {
    const { projectId } = params;
    const query = new GetAllForProjectQuery(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ partnerId: PartnerId }>) {
    const { partnerId } = params;
    const query = new GetByIdQuery(partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async updatePartner(
    params: ApiParams<{
      partnerId: PartnerId;
      partnerDto: PartnerDto;
      validateBankDetails?: boolean;
      verifyBankDetails?: boolean;
    }>,
  ) {
    const context = contextProvider.start(params);
    await context.runCommand(
      new UpdatePartnerCommand(params.partnerDto, params.validateBankDetails, params.verifyBankDetails),
    );

    const query = new GetByIdQuery(params.partnerId);
    return context.runQuery(query);
  }
}

export const controller = new Controller();
