import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetAllForProjectQuery, GetAllQuery, GetByIdQuery } from "../features/partners";
import { PartnerDto } from "@framework/types";
import { processDto } from "@shared/processResponse";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";

export interface IPartnersApi {
  getAll: (params: ApiParams<{}>) => Promise<PartnerDto[]>;
  getAllByProjectId: (params: ApiParams<{ projectId: string }>) => Promise<PartnerDto[]>;
  get: (params: ApiParams<{ partnerId: string }>) => Promise<PartnerDto>;
  updatePartner: (params: ApiParams<{ partnerId: string, partnerDto: PartnerDto, validateBankDetails?: boolean }>) => Promise<PartnerDto>;
}

class Controller extends ControllerBase<PartnerDto> implements IPartnersApi {

  constructor() {
    super("partners");

    this.getItems("/", (p, q) => ({ projectId: q.projectId }), (p) => p.projectId ? this.getAllByProjectId(p): this.getAll(p));
    this.getItem("/:partnerId", (p) => ({ partnerId: p.partnerId }), (p) => this.get(p));
    this.putItem("/:partnerId", (p, q, b) => ({ partnerId: p.partnerId, partnerDto: processDto(b), validateBankDetails: q.validateBankDetails === "true" }), (p) => this.updatePartner(p));
  }

  public async getAll(params: ApiParams<{ }>) {
    const query = new GetAllQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllByProjectId(params: ApiParams<{ projectId: string }>) {
    const { projectId } = params;
    const query = new GetAllForProjectQuery(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ partnerId: string }>) {
    const { partnerId } = params;
    const query = new GetByIdQuery(partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async updatePartner(params: ApiParams<{ partnerId: string, partnerDto: PartnerDto, validateBankDetails?: boolean }>) {
    const context = contextProvider.start(params);
    await context.runCommand(new UpdatePartnerCommand(params.partnerDto, params.validateBankDetails));

    const query = new GetByIdQuery(params.partnerId);
    return context.runQuery(query);
  }
}

export const controller = new Controller();
