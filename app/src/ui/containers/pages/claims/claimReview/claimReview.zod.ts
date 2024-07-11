import { z } from "zod";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { makeZodI18nMap } from "@shared/zodi18n";
import {
  claimIdValidation,
  evaluateObject,
  partnerIdValidation,
  periodIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";

const claimReviewErrorMap = makeZodI18nMap({ keyPrefix: ["claimReview"] });
const claimReviewSchemaCommentsMax = 1000;

const claimReviewSchema = evaluateObject((data: { status: ClaimStatus }) => ({
  form: z.literal(FormTypes.ClaimReviewLevelSaveAndContinue),
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  periodId: periodIdValidation,
  claimId: claimIdValidation,
  status: z.enum([ClaimStatus.MO_QUERIED, ClaimStatus.AWAITING_IUK_APPROVAL]),
  comments: getTextareaValidation({
    label: "forms.claimReview.comments.label",
    maxLength: claimReviewSchemaCommentsMax,
    required: data.status === ClaimStatus.MO_QUERIED,
  }),
}));

type ClaimReviewSchemaType = typeof claimReviewSchema;

export { claimReviewErrorMap, claimReviewSchema, ClaimReviewSchemaType, claimReviewSchemaCommentsMax };
