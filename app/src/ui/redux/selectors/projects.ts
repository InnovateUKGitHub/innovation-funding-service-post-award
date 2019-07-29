import { dataStoreHelper } from "./common";
import { RootState } from "@ui/redux";
import { LoadingStatus, Pending } from "@shared/pending";
import { ProjectStatus } from "@framework/dtos";

export const projectsStore = "projects";
export const getProjects = () => dataStoreHelper(projectsStore, "All");

export const projectStore = "project";
export const getProject = (id: string) => dataStoreHelper(projectStore, id);

export const getActiveProject = (id: string, state: RootState) => {
  const project = getProject(id).getPending(state);
  if (project.data && project.data.status === ProjectStatus.OnHold) {
    return new Pending(LoadingStatus.Failed, project.data, Error("Project On Hold"));
  }
  return project;
};

export const projectContactsStore = "projectContacts";
export const findContactsByProject = (projectId: string) => dataStoreHelper(projectContactsStore, `projectId=${projectId}`);
