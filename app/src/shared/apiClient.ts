import * as Dtos from "../models";

declare const __SERVER_ENV__: boolean;

export interface IApiClient {
  contacts: {
    get: (id: string) => Promise<Dtos.IContact>;
    getAll: () => Promise<Dtos.IContact[]>;
  },
  projects: {
    get: (id: string) => Promise<Dtos.ProjectDto>;
  }
  projectContacts:{
    getAllByProjectId: (projectId: string) => Promise<Dtos.ProjectContactDto[]>
  };
  partners:{
    getAllByProjectId: (projectId: string) => Promise<Dtos.PartnerDto[]>
  };
}

let apiModule: IApiClient;

if(typeof __SERVER_ENV__ !== "undefined" && __SERVER_ENV__ === true) {
  apiModule = require("./serverApiClient").default;
}
else {
  apiModule = require("./clientApiClient").default;
}

export const ApiClient = apiModule;
