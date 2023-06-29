import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { contextProvider } from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/projectContacts/getAllForProjectQuery";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IProjectContactsApi<Context extends "client" | "server"> {
  getAllByProjectId: (params: ApiParams<Context, { projectId: ProjectId }>) => Promise<ProjectContactDto[]>;
}

class Controller extends ControllerBase<"server", ProjectContactDto> implements IProjectContactsApi<"server"> {
  constructor() {
    super("project-contacts");

    this.getItems(
      "/",
      (p, q) => ({ projectId: q.projectId }),
      p => this.getAllByProjectId(p),
    );
  }

  public async getAllByProjectId(params: ApiParams<"server", { projectId: ProjectId }>) {
    const query = new GetAllForProjectQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
