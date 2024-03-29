import { ProjectDto } from "@framework/dtos/projectDto";
import { ProjectStatusDto } from "@framework/dtos/projectStatusDto";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";

import { apiClient } from "../../apiClient";
import { RootActionsOrThunk } from "../actions/root";
import { RootState } from "../reducers/rootReducer";
import { StoreBase } from "./storeBase";

export class ProjectsStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) {
    super(getState, dispatch);
  }

  public getProjects() {
    return this.getData("projects", storeKeys.getProjectsKey(), apiClient.projects.getAll);
  }

  public getProjectsAsDeveloper() {
    return this.getData("projects", storeKeys.getProjectsKeyAsDeveloper(), apiClient.projects.getAllAsDeveloper);
  }

  public getProjectsFilter(searchString?: string | null): Pending<ProjectDto[]> {
    return this.getProjects().then(projects => {
      if (!searchString) return projects;

      return projects.filter(project => {
        const localeSearchValue = searchString.toLocaleLowerCase();

        const itemsToSearch = [
          project.projectNumber?.toString(),
          project.title?.toLocaleLowerCase(),
          project.leadPartnerName?.toLocaleLowerCase(),
        ].filter(Boolean);

        return itemsToSearch.some(searchItem => searchItem.includes(localeSearchValue));
      });
    });
  }

  public getById(projectId: ProjectId): Pending<ProjectDto> {
    return this.getData("project", storeKeys.getProjectKey(projectId), p =>
      apiClient.projects.get({ ...p, projectId }),
    );
  }

  public isValidProject(projectId: ProjectId): Pending<ProjectStatusDto> {
    return this.getData("validate", storeKeys.getValidProjectStatusKey(projectId), p =>
      apiClient.projects.isProjectActive({ ...p, projectId }),
    );
  }
}
