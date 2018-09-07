import { ControllerBase } from "./controllerBase";
import { PartnerDto } from "../../ui/models/partnerDto";
import contextProvider from "../features/common/contextProvider";
import { GetAllForProjectQuery } from "../features/partners/getAllForProjectQuery";

export interface IPartnersApi {
    getAllByProjectId: (projectId: string) => Promise<PartnerDto[]>;
}

class Controller extends ControllerBase<PartnerDto> implements IPartnersApi {
    constructor() {
        super();

        this.getItems("/", (p, q) => ({ projectId: q.projectId as string }), (p) => this.getAllByProjectId(p.projectId));
    }

    public async getAllByProjectId(projectId: string) {
        const query = new GetAllForProjectQuery(projectId);
        return await contextProvider.start().runQuery(query);
    }
}

export const controller = new Controller();
