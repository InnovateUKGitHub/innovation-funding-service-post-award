import contextProvider from "../features/common/contextProvider";
import { ControllerBase } from "./controllerBase";
import { ClaimCostDto } from "../../ui/models/claimCostDto";
import { GetAllCostsForClaimQuery } from "../features/claims/getAllCostsForClaimQuery";
import { clearImmediate } from "timers";


export interface IClaimCostsApi {
    getAllForClaim: (claimId: string) => Promise<ClaimCostDto[]>;
}


class Controller extends ControllerBase<ClaimCostDto> implements IClaimCostsApi {
    constructor() {
        super();

        this.getItems("/", (p, q) => ({ claimId: q.claimId }), (p) => this.getAllForClaim(p.claimId));
    }

    public getAllForClaim(claimId: string) {
        const query = new GetAllCostsForClaimQuery(claimId);
        return contextProvider.start().runQuery(query);
    }
}

export const controller = new Controller();
