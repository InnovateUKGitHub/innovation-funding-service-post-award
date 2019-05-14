import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetAllForProjectQuery, GetAllQuery, GetByIdQuery } from "../features/partners";
import { PartnerDto } from "@framework/types";

export interface IPartnersApi {
  getAll: (params: ApiParams<{}>) => Promise<PartnerDto[]>;
  getAllByProjectId: (params: ApiParams<{ projectId: string }>) => Promise<PartnerDto[]>;
  get: (params: ApiParams<{ partnerId: string }>) => Promise<PartnerDto | null>;
}

class Controller extends ControllerBase<PartnerDto> implements IPartnersApi {

  constructor() {
    super("partners");

    this.getItems("/", (p, q) => ({ projectId: q.projectId }), (p) => p.projectId ? this.getAllByProjectId(p): this.getAll(p));
    this.getItem("/:partnerId", (p) => ({ partnerId: p.partnerId }), (p) => this.get(p));
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
}

export const controller = new Controller();
