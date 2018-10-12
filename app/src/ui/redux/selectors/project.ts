import {ProjectDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const projectStore = "project";

const getProjects = (state: RootState): { [key: string]: IDataStore<ProjectDto> } => (getData(state)[projectStore] || {});

// selectors
export const getProject = (id: string): IDataSelector<ProjectDto> => {
  const get = (state: RootState) => getProjects(state)[id];
  return { key: id, get, getPending: state => Pending.create(get(state)) };
};
