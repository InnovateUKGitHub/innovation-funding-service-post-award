import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { quarterlyOffset } from "./loanDrawdownExtension.logic";
import { FormTypes } from "@ui/zod/FormTypes";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "loanDrawdownExtension"] });

export const loanDrawdownExtensionSchema = z
  .object({
    markedAsComplete: z.boolean(),
    form: z.union([z.literal(FormTypes.PcrLoanDurationChange), z.literal(FormTypes.PcrLoanDurationChangeSummary)]),
    availabilityPeriodChange: z.union([z.number(), z.string()]),
    extensionPeriodChange: z.union([z.number(), z.string()]),
    repaymentPeriodChange: z.union([z.number(), z.string()]),
    availabilityPeriod: z.number(),
    extensionPeriod: z.number(),
    repaymentPeriod: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.markedAsComplete) {
      if (Number(data.availabilityPeriodChange) % quarterlyOffset !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["availabilityPeriodChange"],
        });
      }

      if (Number(data.extensionPeriodChange) % quarterlyOffset !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["extensionPeriodChange"],
        });
      }

      if (Number(data.repaymentPeriodChange) % quarterlyOffset !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["repaymentPeriodChange"],
        });
      }

      if (
        Number(data.availabilityPeriodChange) === data.availabilityPeriod &&
        Number(data.extensionPeriodChange) === data.extensionPeriod &&
        Number(data.repaymentPeriodChange) === data.repaymentPeriod
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["loanDrawdownExtension"],
        });
      }
    }
  });

export type LoanDrawdownExtensionSchemaType = typeof loanDrawdownExtensionSchema;

export type LoanDrawdownExtensionSchema = z.infer<LoanDrawdownExtensionSchemaType>;
