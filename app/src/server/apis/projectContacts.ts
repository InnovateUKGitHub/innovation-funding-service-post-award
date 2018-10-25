import {ControllerBase, ISession} from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import {GetAllForProjectQuery} from "../features/projectContacts/getAllForProjectQuery";
import {ProjectContactDto} from "../../ui/models";

export interface IProjectContactsApi {
  getAllByProjectId: (params: {projectId: string} & ISession) => Promise<ProjectContactDto[]>;
}

class Controller extends ControllerBase<ProjectContactDto> implements IProjectContactsApi {

  constructor() {
    super("project-contacts");

    this.getItems("/", (p, q) => ({projectId: q.projectId}),  (p) => this.getAllByProjectId(p));
  }

  public async getAllByProjectId(params: {projectId: string} & ISession) {
    const query = new GetAllForProjectQuery(params.projectId);
    return await contextProvider.start(params.user).runQuery(query);
  }
}

export const controller = new Controller();
