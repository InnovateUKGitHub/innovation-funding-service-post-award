import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { AllClaimsDashboardRoute, ReviewClaimParams, ReviewClaimRoute, } from "../../ui/containers";
import { ClaimDto, ClaimStatus } from "@framework/types";
import { GetClaim, UpdateClaimCommand } from "../features/claims";
import { getClaimEditor } from "../../ui/redux/selectors";
import { ClaimDtoValidator } from "../../ui/validators";
import { Results } from "../../ui/validation/results";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";

export class ReviewClaimFormHandler extends FormHandlerBase<ReviewClaimParams, ClaimDto> {
    constructor() {
        super(ReviewClaimRoute, ["default"]);
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

    protected getStoreInfo(params: ReviewClaimParams): { key: string; store: string; } {
        return getClaimEditor(params.partnerId, params.periodId);
      }

    protected createValidationResult(params: ReviewClaimParams, dto: ClaimDto): Results<ClaimDto> {
        return new ClaimDtoValidator(dto, ClaimStatus.UNKNOWN, [], [], false);
    }
}
