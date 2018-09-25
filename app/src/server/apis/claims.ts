import { ControllerBase } from "./controllerBase";
import { ClaimDto } from "../../ui/models/claimDto";
import contextProvider from "../features/common/contextProvider";
import { GetAllForPartnerQuery, GetByIdQuery } from "../features/claims";

export interface IClaimsApi {
    getAllByPartnerId: (projectId: string) => Promise<ClaimDto[]>;
    getById: (claimId: string) => Promise<ClaimDto|null>;
}

class Controller extends ControllerBase<ClaimDto> implements IClaimsApi {
    constructor() {
        super();

        this.getItems("/", (p, q) => ({ partnerId: q.partnerId as string }), (p) => this.getAllByPartnerId(p.partnerId));
        this.getItem("/:claimId", (p, q) => ({ claimId: p.claimId as string }), (p) => this.getById(p.claimId));
    }

    public async getAllByPartnerId(partnerId: string) {
        const query = new GetAllForPartnerQuery(partnerId);
        return await contextProvider.start().runQuery(query);
    }

    public async getById(claimId: string) {
        const query = new GetByIdQuery(claimId);
        return await contextProvider.start().runQuery(query);
    }
}

export const controller = new Controller();
