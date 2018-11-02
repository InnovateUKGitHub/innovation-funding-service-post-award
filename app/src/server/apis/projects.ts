import { GetAllQuery, GetByIdQuery } from "../features/projects";
import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { ProjectDto } from "../../ui/models/projectDto";

export interface IProjectsApi {
  get: (params: ApiParams<{ id: string }>) => Promise<ProjectDto | null>;
  getAll: (params: ApiParams<{}>) => Promise<ProjectDto[]>;
}

class Controller extends ControllerBase<ProjectDto> implements IProjectsApi {

  constructor() {
    super("projects");

    super.getItem("/:id", p => ({ id: p.id }), (p) => this.get(p));
    super.getItems("/", p => ({}), (p) => this.getAll(p));
  }

  public async get(params: ApiParams<{ id: string }>) {
    const query = new GetByIdQuery(params.id);
    return await contextProvider.start(params).runQuery(query);
  }

  public async getAll(params: ApiParams<{}>) {
    const query = new GetAllQuery();
    return await contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
