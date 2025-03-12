import { ClaimStatus } from "@framework/constants/claimStatus";
import { IContext } from "@framework/types/IContext";
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
      claimId: input.claimId,
      comments: input.comments,
      status: input.status,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<ClaimReviewSchemaType>;
    context: IContext;
    params: ReviewClaimParams;
  }): Promise<string> {
    await Promise.all([
      context.repositories.claims.update({
        Id: input.claimId,
        Acc_ClaimStatus__c: input.status,
        Acc_ReasonForDifference__c: "",
      }),

      context.repositories.claimStatusChanges.create({
        Acc_Claim__c: input.claimId,
        Acc_ExternalComment__c: input.comments,
        Acc_ParticipantVisibility__c: input.status === ClaimStatus.MO_QUERIED,
      }),
    ]);

    return AllClaimsDashboardRoute.getLink({ projectId: params.projectId }).path;
  }
}
