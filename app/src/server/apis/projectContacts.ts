import { ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/projectContacts/getAllForProjectQuery";
import { ProjectContactDto } from "../../models";

export interface IProjectContactsApi {
    getAllByProjectId: (projectId: string) => Promise<ProjectContactDto[]>;
}

class Controller extends ControllerBase<ProjectContactDto> implements IProjectContactsApi {
    constructor() {
        super();

        this.getItems("/", (p, q) => ({ projectId: q.projectId }), p => this.getAllByProjectId(p.projectId));
    }

    public async getAllByProjectId(projectId: string) {
        const query = new GetAllForProjectQuery(projectId);
        return await contextProvider.start().runQuery(query);
    }
}

export const controller = new Controller();
