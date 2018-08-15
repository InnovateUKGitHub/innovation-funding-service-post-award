import { ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/projectContacts/getAllForProjectQuery";

interface ProjectContactDto{

}

class Controller extends ControllerBase<ProjectContactDto>
{
    constructor(){
        super("projectcontacts");

        this.getItems("/", (p,q) => ({projectId: q.projectId}), p => this.getAllByProjectID(p.projectId));
    }

    public async getAllByProjectID(projectId: string) {
        const query = new GetAllForProjectQuery(projectId);
        return await contextProvider.start().runQuery(query);
    }

}

export const controller = new Controller();
