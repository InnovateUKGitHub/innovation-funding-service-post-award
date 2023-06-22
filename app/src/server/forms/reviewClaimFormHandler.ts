import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ClaimDto } from "@framework/dtos/claimDto";
import { GetClaim } from "@server/features/claims/getClaim";
import { UpdateClaimCommand } from "@server/features/claims/updateClaim";
import { AllClaimsDashboardRoute } from "@ui/containers/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { ReviewClaimParams, ReviewClaimRoute } from "@ui/containers/claims/claimReview.page";

export class ReviewClaimFormHandler extends StandardFormHandlerBase<ReviewClaimParams, "claim"> {
  constructor() {
    super(ReviewClaimRoute, ["default"], "claim");
  }

  protected async getDto(
    context: IContext,
    params: ReviewClaimParams,
    _button: IFormButton,
    body: IFormBody,
  ): Promise<ClaimDto> {
    const claim = await context.runQuery(new GetClaim(params.partnerId, params.periodId));

    claim.comments = body.comments;

    // Note: Prepare claim for the next status
    switch (body.status) {
      case ClaimStatus.MO_QUERIED:
        claim.status = ClaimStatus.MO_QUERIED;
        break;

      case ClaimStatus.AWAITING_IUK_APPROVAL: {
        const isIarReceived: boolean = claim.iarStatus !== "Received";
        const isNotReceivedIar: boolean = !!claim.isIarRequired && isIarReceived;

        claim.status = isNotReceivedIar ? ClaimStatus.AWAITING_IAR : ClaimStatus.AWAITING_IUK_APPROVAL;
        break;
      }

      default:
        break;
    }

    return claim;
  }

  protected async run(
    context: IContext,
    params: ReviewClaimParams,
    _button: IFormButton,
    dto: ClaimDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdateClaimCommand(params.projectId, dto));

    return AllClaimsDashboardRoute.getLink(params);
  }

  protected getStoreKey(params: ReviewClaimParams) {
    return storeKeys.getClaimKey(params.partnerId, params.periodId);
  }

  protected createValidationResult(_params: ReviewClaimParams, dto: ClaimDto) {
    return new ClaimDtoValidator(dto, ClaimStatus.UNKNOWN, [], [], false, "");
  }
}
