import { IFormBody, IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { AllClaimsDashboardRoute, ReviewClaimParams, ReviewClaimRoute, } from "../../ui/containers";
import { ClaimDto, ClaimStatus } from "@framework/types";
import { GetClaim, UpdateClaimCommand } from "../features/claims";
import { getClaimEditor } from "../../ui/redux/selectors";
import { ClaimDtoValidator } from "../../ui/validators";
import { Results } from "../../ui/validation/results";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";

export class ReviewClaimFormHandler extends StandardFormHandlerBase<ReviewClaimParams, "claim"> {
    constructor() {
        super(ReviewClaimRoute, ["default"], "claim");
    }

    protected async getDto(context: IContext, params: ReviewClaimParams, button: IFormButton, body: IFormBody): Promise<ClaimDto> {
        const claim = await context.runQuery(new GetClaim(params.partnerId, params.periodId));

        if (body.status === ClaimStatus.MO_QUERIED) {
            claim.status = ClaimStatus.MO_QUERIED;
        }
        else if (body.status === ClaimStatus.AWAITING_IUK_APPROVAL) {
            claim.status = ClaimStatus.AWAITING_IUK_APPROVAL;
        }

        return claim;
    }

    protected async run(context: IContext, params: ReviewClaimParams, button: IFormButton, dto: ClaimDto): Promise<ILinkInfo> {
        await context.runCommand(new UpdateClaimCommand(params.projectId, dto));
        return AllClaimsDashboardRoute.getLink(params);
    }

    protected getStoreKey(params: ReviewClaimParams) {
        return getClaimEditor(params.partnerId, params.periodId).key;
      }

    protected createValidationResult(params: ReviewClaimParams, dto: ClaimDto) {
        return new ClaimDtoValidator(dto, ClaimStatus.UNKNOWN, [], [], false);
    }
}
