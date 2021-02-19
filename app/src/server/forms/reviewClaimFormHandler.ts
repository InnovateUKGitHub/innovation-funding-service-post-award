import { ClaimDto, ClaimStatus } from "@framework/types";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ClaimDtoValidator } from "../../ui/validators";
import { GetClaim, UpdateClaimCommand } from "../features/claims";
import { AllClaimsDashboardRoute, ReviewClaimParams, ReviewClaimRoute, } from "../../ui/containers";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "./formHandlerBase";

export class ReviewClaimFormHandler extends StandardFormHandlerBase<ReviewClaimParams, "claim"> {
    constructor() {
        super(ReviewClaimRoute, ["default"], "claim");
    }

    protected async getDto(context: IContext, params: ReviewClaimParams, button: IFormButton, body: IFormBody): Promise<ClaimDto> {
        const claim = await context.runQuery(new GetClaim(params.partnerId, params.periodId));

        if (body.status === ClaimStatus.MO_QUERIED) {
            claim.status = ClaimStatus.MO_QUERIED;
        } else if (body.status === ClaimStatus.AWAITING_IUK_APPROVAL) {
            claim.status = ClaimStatus.AWAITING_IUK_APPROVAL;
        }

        claim.comments = body.comments;

        return claim;
    }

    protected async run(context: IContext, params: ReviewClaimParams, button: IFormButton, dto: ClaimDto): Promise<ILinkInfo> {
        await context.runCommand(new UpdateClaimCommand(params.projectId, dto));
        return AllClaimsDashboardRoute.getLink(params);
    }

    protected getStoreKey(params: ReviewClaimParams) {
        return storeKeys.getClaimKey(params.partnerId, params.periodId);
    }

    protected createValidationResult(params: ReviewClaimParams, dto: ClaimDto) {
        return new ClaimDtoValidator(dto, ClaimStatus.UNKNOWN, [], [], [], false);
    }
}
