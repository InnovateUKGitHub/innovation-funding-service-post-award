import {ControllerBase} from "./controllerBase";
import {PartnerDto} from "../../ui/models/partnerDto";
import contextProvider from "../features/common/contextProvider";
import {GetAllForProjectQuery, GetByIdQuery} from "../features/partners";

export interface IPartnersApi {
  getAllByProjectId: (projectId: string) => Promise<PartnerDto[]>;
  get: (id: string) => Promise<PartnerDto | null>;
}

class Controller extends ControllerBase<PartnerDto> implements IPartnersApi {

  constructor() {
    super("partners");

    this.getItems("/", (p, q) => ({projectId: q.projectId as string}), (p) => this.getAllByProjectId(p.projectId));
    this.getItem("/:id", (p) => ({id: p.id as string}), (p) => this.get(p.id));
  }

  public async getAllByProjectId(projectId: string) {
    const query = new GetAllForProjectQuery(projectId);
    return await contextProvider.start().runQuery(query);
  }

  public async get(id: string) {
    const query = new GetByIdQuery(id);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
