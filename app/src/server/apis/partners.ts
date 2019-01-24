import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetAllForProjectQuery, GetByIdQuery } from "../features/partners";
import { PartnerDto } from "../../types";

export interface IPartnersApi {
  getAllByProjectId: (params: ApiParams<{ projectId: string }>) => Promise<PartnerDto[]>;
  get: (params: ApiParams<{ partnerId: string }>) => Promise<PartnerDto | null>;
}

class Controller extends ControllerBase<PartnerDto> implements IPartnersApi {

  constructor() {
    super("partners");

    this.getItems("/", (p, q) => ({ projectId: q.projectId as string }), (p) => this.getAllByProjectId(p));
    this.getItem("/:partnerId", (p) => ({ partnerId: p.partnerId as string }), (p) => this.get(p));
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
