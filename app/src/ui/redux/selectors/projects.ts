import { dataStoreHelper } from "./common";

export const projectsStore = "projects";
export const getProjects = () => dataStoreHelper(projectsStore, "All");

export const projectStore = "project";
export const getProject = (id: string) => dataStoreHelper(projectStore, id);

export const projectContactsStore = "projectContacts";
export const findContactsByProject = (projectId: string) => dataStoreHelper(projectContactsStore, `projectId=${projectId}`);
