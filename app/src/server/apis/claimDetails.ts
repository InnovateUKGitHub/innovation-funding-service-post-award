import { ControllerBase } from "./controllerBase";
import { ClaimDetailDto } from "../../ui/models/claimDetailDto";
import contextProvider from "../features/common/contextProvider";
import { GetAllForPartnerQuery } from "../features/claims/claimDetails/getAllForPartnerQuery";

export interface IClaimDetailsApi {
    getAllByPartnerId: (partnerId: string, periodId: number) => Promise<ClaimDetailDto[]>;
}

class Controller extends ControllerBase<ClaimDetailDto> implements IClaimDetailsApi {
    constructor() {
        super();

        this.getItems("/", (p, q) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10)}), (p) => this.getAllByPartnerId(p.partnerId, p.periodId));
    }

    public async getAllByPartnerId(partnerId: string, periodId: number) {
        const query = new GetAllForPartnerQuery(partnerId, periodId);
        return await contextProvider.start().runQuery(query);
    }
}

export const controller = new Controller();
