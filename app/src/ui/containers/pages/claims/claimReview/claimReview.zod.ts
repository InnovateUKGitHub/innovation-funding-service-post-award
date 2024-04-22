import { z } from "zod";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { makeZodI18nMap } from "@shared/zodi18n";
import {
  claimIdValidation,
  partnerIdValidation,
  periodIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";

const claimReviewErrorMap = makeZodI18nMap({ keyPrefix: ["claimReview"] });
const claimReviewSchemaCommentsMax = 1000;

const claimReviewSchema = z
  .object({
    form: z.literal(FormTypes.ClaimReviewLevelSaveAndContinue),
    projectId: projectIdValidation,
    partnerId: partnerIdValidation,
    periodId: periodIdValidation,
    claimId: claimIdValidation,
    status: z.enum([ClaimStatus.MO_QUERIED, ClaimStatus.AWAITING_IUK_APPROVAL]),
    comments: z.string().max(claimReviewSchemaCommentsMax),
  })
  .refine(({ status, comments }) => status !== ClaimStatus.MO_QUERIED || comments?.length >= 1, {
    path: ["comments"],
  });

type ClaimReviewSchemaType = typeof claimReviewSchema;

export { claimReviewErrorMap, claimReviewSchema, ClaimReviewSchemaType, claimReviewSchemaCommentsMax };
