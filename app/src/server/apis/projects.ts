import {GetAllQuery, GetByIdQuery} from "../features/projects";
import {ControllerBase, ISession} from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import {ProjectDto} from "../../ui/models/projectDto";

export interface IProjectsApi {
  get: (params: {id: string} & ISession) => Promise<ProjectDto | null>;
  getAll: (params: ISession) => Promise<ProjectDto[]>;
}

class Controller extends ControllerBase<ProjectDto> implements IProjectsApi {

  constructor() {
    super("projects");

    super.getItem("/:id", p => ({id: p.id}),  (p) => this.get(p));
    super.getItems("/", p => ({}),  (p) => this.getAll(p));
  }

  public async get(params: {id: string} & ISession) {
    const query = new GetByIdQuery(params.id);
    return await contextProvider.start(params.user).runQuery(query);
  }

  public async getAll(params: ISession) {
    const query = new GetAllQuery();
    return await contextProvider.start(params.user).runQuery(query);
  }
}

export const controller = new Controller();
