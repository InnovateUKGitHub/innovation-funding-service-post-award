import { ProjectDto } from "@framework/dtos/projectDto";
import { ProjectStatusDto } from "@framework/dtos/projectStatusDto";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { configuration } from "@server/features/common/config";
import { contextProvider } from "@server/features/common/contextProvider";
import { GetAllQuery } from "@server/features/projects/getAllQuery";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { GetProjectStatusQuery } from "@server/features/projects/GetProjectStatus";

export interface IProjectsApi<Context extends "client" | "server"> {
  isProjectActive(params: ApiParams<Context, { projectId: ProjectId }>): Promise<ProjectStatusDto>;
  get(params: ApiParams<Context, { projectId: ProjectId }>): Promise<ProjectDto>;
  getAll(params: ApiParams<Context>): Promise<ProjectDto[]>;
  getAllAsDeveloper(params: ApiParams<Context>): Promise<ProjectDto[]>;
}

class Controller extends ControllerBase<"server", ProjectDto> implements IProjectsApi<"server"> {
  constructor() {
    super("projects");

    this.getItems("/", () => ({}), this.getAll);
    if (!configuration.sso.enabled) {
      this.getItems("/allAsDeveloper", () => ({}), this.getAllAsDeveloper);
    }
    this.getCustom("/project-active/:projectId", p => ({ projectId: p.projectId as ProjectId }), this.isProjectActive);
    this.getItem("/:projectId", p => ({ projectId: p.projectId as ProjectId }), this.get);
  }

  public async isProjectActive(params: ApiParams<"server", { projectId: ProjectId }>): Promise<ProjectStatusDto> {
    const query = new GetProjectStatusQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<"server", { projectId: ProjectId }>): Promise<ProjectDto> {
    const query = new GetByIdQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getAll(params: ApiParams<"server">): Promise<ProjectDto[]> {
    const query = new GetAllQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllAsDeveloper(params: ApiParams<"server">): Promise<ProjectDto[]> {
    const query = new GetAllQuery();
    return contextProvider.start(params).asSystemUser().runQuery(query);
  }
}

export const controller = new Controller();
