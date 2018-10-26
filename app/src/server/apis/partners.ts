import { ControllerBase, ApiParams } from "./controllerBase";
import { PartnerDto } from "../../ui/models/partnerDto";
import contextProvider from "../features/common/contextProvider";
import { GetAllForProjectQuery, GetByIdQuery } from "../features/partners";

export interface IPartnersApi {
  getAllByProjectId: (params: ApiParams<{ projectId: string }>) => Promise<PartnerDto[]>;
  get: (params: ApiParams<{ id: string }>) => Promise<PartnerDto | null>;
}

class Controller extends ControllerBase<PartnerDto> implements IPartnersApi {

  constructor() {
    super("partners");

    this.getItems("/", (p, q) => ({ projectId: q.projectId as string }), (p) => this.getAllByProjectId(p));
    this.getItem("/:id", (p) => ({ id: p.id as string }), (p) => this.get(p));
  }

  public async getAllByProjectId(params: ApiParams<{ projectId: string }>) {
    const { projectId, user } = params;
    const query = new GetAllForProjectQuery(projectId);
    return await contextProvider.start(user).runQuery(query);
  }

  public async get(params: ApiParams<{ id: string }>) {
    const { id, user } = params;
    const query = new GetByIdQuery(id);
    return await contextProvider.start(user).runQuery(query);
  }
}

export const controller = new Controller();
