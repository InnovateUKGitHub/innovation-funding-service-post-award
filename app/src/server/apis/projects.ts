import { ProjectDto, ProjectStatusDto } from "@framework/types";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";

import { contextProvider } from "@server/features/common/contextProvider";
import { GetAllQuery, GetByIdQuery, GetProjectStatusQuery } from "@server/features/projects";
import { configuration } from "@server/features/common/config";

class Controller extends ControllerBase<ProjectDto> implements IProjectsApi {
  constructor() {
    super("projects");

    this.getItems("/", () => ({}), this.getAll);
    if (!configuration.sso.enabled) {
      this.getItems("/allAsDeveloper", () => ({}), this.getAllAsDeveloper);
    }
    this.getCustom("/project-active/:projectId", p => ({ projectId: p.projectId }), this.isProjectActive);
    this.getItem("/:projectId", p => ({ projectId: p.projectId }), this.get);
  }

  public async isProjectActive(params: ApiParams<{ projectId: string }>): Promise<ProjectStatusDto> {
    const query = new GetProjectStatusQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ projectId: string }>): Promise<ProjectDto> {
    const query = new GetByIdQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getAll(params: ApiParams): Promise<ProjectDto[]> {
    const query = new GetAllQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllAsDeveloper(params: ApiParams<{}>): Promise<ProjectDto[]> {
    const query = new GetAllQuery();
    return contextProvider.start(params).asSystemUser().runQuery(query);
  }
}

export const controller = new Controller();

export type IProjectsApi = Pick<Controller, "get" | "getAll" | "isProjectActive" | "getAllAsDeveloper">;
