import { GetAllQuery, GetByIdQuery } from "../features/projects";
import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { ProjectDto } from "@framework/types";

export interface IProjectsApi {
  get: (params: ApiParams<{ projectId: string }>) => Promise<ProjectDto>;
  getAll: (params: ApiParams<{}>) => Promise<ProjectDto[]>;
}

class Controller extends ControllerBase<ProjectDto> implements IProjectsApi {

  constructor() {
    super("projects");

    super.getItem("/:projectId", p => ({ projectId: p.projectId }), (p) => this.get(p));
    super.getItems("/", p => ({}), (p) => this.getAll(p));
  }

  public async get(params: ApiParams<{ projectId: string }>) {
    const query = new GetByIdQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getAll(params: ApiParams<{}>) {
    const query = new GetAllQuery();
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
