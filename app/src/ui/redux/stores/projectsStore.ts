import { ApiClient } from "../../apiClient";
import { RootState } from "../reducers";
import { StoreBase } from "./storeBase";
import { RootActionsOrThunk } from "../actions";

export class ProjectsStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) {
    super(getState, dispatch);
  }

  public getProjects() {
    return this.getData("projects", "all", p => ApiClient.projects.getAll(p));
  }

  public getById(projectId: string) {
    return this.getData("project", projectId, p => ApiClient.projects.get({ projectId, ...p }));
  }
}
