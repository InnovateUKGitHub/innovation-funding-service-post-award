import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const loanRequestErrorMap = makeZodI18nMap({ keyPrefix: ["loanRequest"] });

export const loanRequestSchema = z.object({
  comments: getTextValidation({
    minLength: 5,
    maxLength: 32768,
    required: true,
  }),
  attachmentsCount: z.number().min(1),
  form: z.literal(FormTypes.LoanRequest),
});

export type LoanRequestSchemaType = typeof loanRequestSchema;
