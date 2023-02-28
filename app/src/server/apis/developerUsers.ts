import { DeveloperUser } from "@framework/dtos/developerUser";
import { configuration } from "@server/features/common";
import { GetAllUsersForProjectQuery } from "@server/features/developer/GetAllUsersForProjectQuery";
import { contextProvider } from "../features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IDeveloperUsersApi {
  getAllByProjectId: (params: ApiParams<{ projectId: ProjectId }>) => Promise<DeveloperUser[]>;
}

class Controller extends ControllerBase<DeveloperUser> implements IDeveloperUsersApi {
  constructor() {
    super("developer-users");

    if (!configuration.sso.enabled) {
      this.getItems(
        "/:projectId",
        p => ({ projectId: p.projectId }),
        p => this.getAllByProjectId(p),
      );
    }
  }

  public async getAllByProjectId(params: ApiParams<{ projectId: ProjectId }>) {
    const query = new GetAllUsersForProjectQuery(params.projectId);
    return contextProvider.start(params).asSystemUser().runQuery(query);
  }
}

export const controller = new Controller();
