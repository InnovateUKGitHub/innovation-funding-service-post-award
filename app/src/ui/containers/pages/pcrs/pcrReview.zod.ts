import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";

export const pcrReviewErrorMap = makeZodI18nMap({ keyPrefix: ["pcrReview"] });

export const pcrReviewSchema = z.object({
  comments: getTextValidation({ required: true, minLength: 1, maxLength: 1000 }),
  status: z.string().min(1),
});

export type PcrReviewSchemaType = z.infer<typeof pcrReviewSchema>;
