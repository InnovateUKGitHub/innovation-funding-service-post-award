import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const loanRequestErrorMap = makeZodI18nMap({ keyPrefix: ["loanRequest"] });

export const loanRequestSchema = z.object({
  comments: getTextareaValidation({
    minLength: 5,
    maxLength: 32768,
    label: "forms.loanRequest.comments.label",
    required: true,
  }),
  attachmentsCount: z.number().min(1),
  form: z.literal(FormTypes.LoanRequest),
});

export type LoanRequestSchemaType = typeof loanRequestSchema;
