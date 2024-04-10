import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const pcrReviewErrorMap = makeZodI18nMap({ keyPrefix: ["pcrReview"] });

export const pcrReviewSchema = z.object({
  comments: z.string().max(1000).optional(),
  status: z.string().min(1),
});

export type PcrReviewSchemaType = z.infer<typeof pcrReviewSchema>;
