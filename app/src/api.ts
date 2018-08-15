// tslint:disable:no-var-requires
import { IContact, ProjectDto } from "./models";
import { PartnerDto } from "./models/partnerDto";
// webpack declared variable
declare const __SERVER_ENV__: boolean;

export interface IApi {
  contacts: {
    get: (id: string) => Promise<IContact>;
    getAll: () => Promise<IContact[]>;
  },
  projects: {
    get: (id: string) => Promise<ProjectDto>;
  }
  partners:{
    getAllByProjectId: (projectId: string) => Promise<PartnerDto[]>
  };
}

let apiModule: IApi;

if(typeof __SERVER_ENV__ !== "undefined" && __SERVER_ENV__ === true) {
  apiModule = require("./server/apis").api;
}
else {
  apiModule = require("./client/apis").api;
}

export const Api = apiModule;
