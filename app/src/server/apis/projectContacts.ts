import {ControllerBase, ApiParams} from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import {GetAllForProjectQuery} from "../features/projectContacts/getAllForProjectQuery";
import {ProjectContactDto} from "../../ui/models";

export interface IProjectContactsApi {
  getAllByProjectId: (params: ApiParams<{projectId: string}>) => Promise<ProjectContactDto[]>;
}

class Controller extends ControllerBase<ProjectContactDto> implements IProjectContactsApi {

  constructor() {
    super("project-contacts");

    this.getItems("/", (p, q) => ({projectId: q.projectId}),  (p) => this.getAllByProjectId(p));
  }

  public async getAllByProjectId(params: ApiParams<{projectId: string}>) {
    const query = new GetAllForProjectQuery(params.projectId);
    return await contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
