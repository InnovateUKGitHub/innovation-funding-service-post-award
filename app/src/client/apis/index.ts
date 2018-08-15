import { IApi } from "../../api";
import * as contacts from "./contacts";
import * as projects from "./projects";
import * as partners from "./projects";

export const api: IApi = {
  contacts,
  projects,
  partners: {
    getAllByProjectId: (partnerId: string) => fetch(`http://localhost:8080/api/partners`) as any
  }
};
