import {conditionalLoad} from "./dataLoad";
import { ApiClient } from "../../apiClient";
import { getProject, projectStore } from "../selectors/project";

export function loadProject(id: string) {
  return conditionalLoad(
    getProject(id).key,
    projectStore,
    (params) => ApiClient.projects.get({id, ...params})
  );
}
