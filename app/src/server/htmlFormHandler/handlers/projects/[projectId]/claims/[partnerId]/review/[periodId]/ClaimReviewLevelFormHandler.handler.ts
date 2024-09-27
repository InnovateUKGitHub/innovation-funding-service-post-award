import { ClaimDto } from "@framework/dtos/claimDto";
import { IContext } from "@framework/types/IContext";
import { UpdateClaimCommand } from "@server/features/claims/updateClaim";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { AllClaimsDashboardRoute } from "@ui/pages/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ReviewClaimParams, ReviewClaimRoute } from "@ui/pages/claims/claimReview/claimReview.page";
import {
  ClaimReviewSchemaType,
  claimReviewErrorMap,
  claimReviewSchema,
} from "@ui/pages/claims/claimReview/claimReview.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export class ClaimReviewLevelFormHandler extends ZodFormHandlerBase<ClaimReviewSchemaType, ReviewClaimParams> {
  constructor() {
    super({ routes: [ReviewClaimRoute], forms: [FormTypes.ClaimReviewLevelSaveAndContinue] });
  }

  public readonly acceptFiles = false;

  async getZodSchema() {
    return {
      schema: claimReviewSchema,
      errorMap: claimReviewErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ClaimReviewSchemaType>> {
    return {
      form: input.form,
      projectId: input.projectId,
      partnerId: input.partnerId,
      periodId: Number(input.periodId),
      claimId: input.claimId,
      comments: input.comments,
      status: input.status,
      isIarMissing: input.isIarMissing,
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<ClaimReviewSchemaType>;
    context: IContext;
  }): Promise<string> {
    await context.runCommand(
      new UpdateClaimCommand(input.projectId, {
        id: input.claimId,
        partnerId: input.partnerId,
        periodId: input.periodId,
        comments: input.comments,
        status: input.status,
      } as ClaimDto),
    );

    return AllClaimsDashboardRoute.getLink({ projectId: input.projectId }).path;
  }
}
