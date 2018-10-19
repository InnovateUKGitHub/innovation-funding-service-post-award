import {ProjectDto} from "../../models";
import { IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const projectsStore = "projects";

const getProjectsCollection = (state: RootState): { [key: string]: IDataStore<ProjectDto[]> } => (getData(state)[projectsStore] || {});

// selectors
export const getProjects = (): IDataSelector<ProjectDto[]> => {
  const key =  "All";
  const get = (state: RootState) => getProjectsCollection(state).All;
  return { key, get, getPending: (state: RootState) => Pending.create(get(state))};
};
