import { ApiClient } from "../../apiClient";
import { RootState } from "../reducers";
import { StoreBase } from "./storeBase";
import { RootActionsOrThunk } from "../actions";
import { ProjectDto } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ProjectsStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) {
    super(getState, dispatch);
  }

  public getProjects() {
    return this.getData("projects", storeKeys.getProjectsKey(), p => ApiClient.projects.getAll(p));
  }

  public getProjectsFilter(searchString?: string|null): Pending<ProjectDto[]> {
    return this.getProjects().then(projects => {
        if (!searchString) return projects;
        return projects.filter(project =>
          project.projectNumber && project.projectNumber.toString().indexOf(searchString.toLocaleLowerCase()) >= 0
          || project.title && project.title.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) >= 0
          || project.leadPartnerName && project.leadPartnerName.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) >= 0
        );
      });
  }

  public getById(projectId: string) {
    return this.getData("project", storeKeys.getProjectKey(projectId), p => ApiClient.projects.get({ projectId, ...p }));
  }
}
