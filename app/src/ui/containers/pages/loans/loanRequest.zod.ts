import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const loanRequestErrorMap = makeZodI18nMap({ keyPrefix: ["loanRequest"] });

export const loanRequestSchema = z.object({
  comments: z.string().max(32768),
  attachmentsCount: z.number().min(1),
  form: z.literal(FormTypes.LoanRequest),
});

export type LoanRequestSchemaType = typeof loanRequestSchema;
