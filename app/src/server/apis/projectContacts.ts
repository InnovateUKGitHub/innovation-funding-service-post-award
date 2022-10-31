import { ProjectContactDto } from "@framework/dtos";
import { configuration } from "@server/features/common";
import { contextProvider } from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/projectContacts/getAllForProjectQuery";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IProjectContactsApi {
  getAllByProjectId: (params: ApiParams<{ projectId: string }>) => Promise<ProjectContactDto[]>;
  getAllByProjectIdAsDeveloper: (params: ApiParams<{ projectId: string }>) => Promise<ProjectContactDto[]>;
}

class Controller extends ControllerBase<ProjectContactDto> implements IProjectContactsApi {
  constructor() {
    super("project-contacts");

    this.getItems(
      "/",
      (p, q) => ({ projectId: q.projectId }),
      p => this.getAllByProjectId(p),
    );
    if (!configuration.sso.enabled) {
      this.getItems(
        "/allAsDeveloper",
        (p, q) => ({ projectId: q.projectId }),
        p => this.getAllByProjectIdAsDeveloper(p),
      );
    }
  }

  public async getAllByProjectId(params: ApiParams<{ projectId: string }>) {
    const query = new GetAllForProjectQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }
  public async getAllByProjectIdAsDeveloper(params: ApiParams<{ projectId: string }>) {
    const query = new GetAllForProjectQuery(params.projectId);
    return contextProvider.start(params).asSystemUser().runQuery(query);
  }
}

export const controller = new Controller();
