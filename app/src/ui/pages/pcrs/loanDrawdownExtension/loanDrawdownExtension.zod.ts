import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { quarterlyOffset } from "./loanDrawdownExtension.logic";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "loanDrawdownExtension"] });

export const loanDrawdownExtensionSchema = ({
  availabilityPeriod,
  extensionPeriod,
  repaymentPeriod,
}: {
  availabilityPeriod: number;
  extensionPeriod: number;
  repaymentPeriod: number;
}) =>
  z
    .object({
      markedAsComplete: z.boolean(),
      availabilityPeriodChange: z.string(),
      extensionPeriodChange: z.string(),
      repaymentPeriodChange: z.string(),
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
          Number(data.availabilityPeriodChange) === availabilityPeriod &&
          Number(data.extensionPeriodChange) === extensionPeriod &&
          Number(data.repaymentPeriodChange) === repaymentPeriod
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["loanDrawdownExtension"],
          });
        }
      }
    });

export type LoanDrawdownExtensionSchema = z.infer<ReturnType<typeof loanDrawdownExtensionSchema>>;
