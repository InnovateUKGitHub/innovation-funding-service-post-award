import { dataStoreHelper, IDataSelector } from "./common";
import { ProjectContactDto, ProjectDto } from "../../models";

export const projectsStore = "projects";
export const getProjects = () => dataStoreHelper(projectsStore, "All") as IDataSelector<ProjectDto[]>;

export const projectStore = "project";
export const getProject = (id: string) => dataStoreHelper(projectStore, id) as IDataSelector<ProjectDto>;

export const projectContactsStore = "projectContacts";
export const findContactsByProject = (projectId: string) => dataStoreHelper(projectContactsStore, `projectId=${projectId}`) as IDataSelector<ProjectContactDto[]>;
