import { z } from "zod";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { makeZodI18nMap } from "@shared/zodi18n";

export const claimReviewErrorMap = makeZodI18nMap({ keyPrefix: ["claimReview"] });
export const documentUploadErrorMap = makeZodI18nMap({ keyPrefix: ["uploadDocuments"] });

export const claimReviewSchema = z
  .object({
    status: z.enum([ClaimStatus.MO_QUERIED, ClaimStatus.AWAITING_IUK_APPROVAL]),
    comments: z.string().max(1000),
  })
  .refine(({ status, comments }) => status !== ClaimStatus.MO_QUERIED || comments?.length >= 1, {
    path: ["comments"],
  });

export const documentUploadSchema = z.object({
  attachment: z.object({
    length: z.number().gt(0),
  }),
});
