import { ControllerBase } from "./controllerBase";
import { ClaimDto } from "../../ui/models/claimDto";
import contextProvider from "../features/common/contextProvider";
import { GetAllForPartnerQuery } from "../features/claims";

export interface IClaimsApi {
    getAllByPartnerId: (projectId: string) => Promise<ClaimDto[]>;
}

class Controller extends ControllerBase<ClaimDto> implements IClaimsApi {
    constructor() {
        super();

        this.getItems("/", (p, q) => ({ partnerId: q.partnerId as string }), (p) => this.getAllByPartnerId(p.partnerId));
    }

    public async getAllByPartnerId(partnerId: string) {
        const query = new GetAllForPartnerQuery(partnerId);
        return await contextProvider.start().runQuery(query);
    }
}

export const controller = new Controller();
