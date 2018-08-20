import { ControllerBase } from "./controllerBase";
import { PartnerDto } from "../../models/PartnerDto";
import contextProvider from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/partners/getAllForProjectQuery";

class Controller extends ControllerBase<PartnerDto> {
    constructor() {
        super("partners");

        this.getItems("/?", (p,q) => ({projectId: q.projectId}), (p) => this.getAllByProjectId(p.projectId));
    }

    public async getAllByProjectId(projectId: string) {
        const query = new GetAllForProjectQuery(projectId);
        return await contextProvider.start().runQuery(query);
    }
}

export const controller = new Controller();
