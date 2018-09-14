import { IContext, IQuery } from "../common/context";
import { ClaimDto } from "../../../ui/models/claimDto";
import mapClaim from "./mapClaim";

export class GetAllForPartnerQuery implements IQuery<ClaimDto[]> {
    constructor(private partnerId: string) {
    }

    public async Run(context: IContext) {
        const results = await context.repositories.claims.getAllByPartnerId(this.partnerId);
        return results && results.map(mapClaim(context));
    }
}

export class GetByIdQuery implements IQuery<ClaimDto> {
    constructor(private claimId: string) {
    }

    public async Run(context: IContext) {
        const result = await context.repositories.claims.getById(this.claimId);
        return mapClaim(context)(result);
    }
}
