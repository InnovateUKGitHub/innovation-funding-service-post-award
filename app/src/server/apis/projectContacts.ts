import { ProjectContactDto } from "@framework/dtos";
import { contextProvider } from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/projectContacts/getAllForProjectQuery";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IProjectContactsApi {
  getAllByProjectId: (params: ApiParams<{ projectId: string }>) => Promise<ProjectContactDto[]>;
}

class Controller extends ControllerBase<ProjectContactDto> implements IProjectContactsApi {
  constructor() {
    super("project-contacts");

    this.getItems(
      "/",
      (p, q) => ({ projectId: q.projectId }),
      p => this.getAllByProjectId(p),
    );
  }

  public async getAllByProjectId(params: ApiParams<{ projectId: string }>) {
    const query = new GetAllForProjectQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
