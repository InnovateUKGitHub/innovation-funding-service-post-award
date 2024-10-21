import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { FormTypes } from "@ui/zod/FormTypes";

export const pcrReviewErrorMap = makeZodI18nMap({ keyPrefix: ["pcrReview"] });

export const pcrReviewSchema = z.object({
  comments: getTextValidation({ required: true, minLength: 1, maxLength: 1000 }),
  status: z.string().min(1),
  form: z.literal(FormTypes.PcrReview),
});

export type PcrReviewSchema = typeof pcrReviewSchema;

export type PcrReviewSchemaType = z.infer<PcrReviewSchema>;
