import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { getProject, projectStore } from "../selectors/project";

export function loadProject(id: string) {
  return conditionalLoad(
    getProject(id).key,
    projectStore,
    () => {
      return ApiClient.projects.get(id);
    }
  );
}
