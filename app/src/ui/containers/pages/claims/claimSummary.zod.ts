import { ZodIssueCode, z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { DocumentDescription } from "@framework/constants/documentDescription";

export const claimSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["claimSummary"] });

export const getClaimSummarySchema = ({ iarRequired, pcfRequired }: { iarRequired: boolean; pcfRequired: boolean }) =>
  z.discriminatedUnion("button_submit", [
    z.object({
      button_submit: z.literal("submit"),
      status: z.string(),
      comments: z.string().max(1000),
      documents: z
        .object({ description: z.nullable(z.number()).optional() })
        .array()
        .superRefine((data, ctx) => {
          // x => !iarRequired || x.some(doc => doc.description === DocumentDescription.IAR)

          if (iarRequired) {
            if (!data.some(doc => doc.description === DocumentDescription.IAR)) {
              ctx.addIssue({ code: ZodIssueCode.custom, params: { i18n: "errors.iar_required" } });
            }
          }

          if (pcfRequired) {
            if (!data.some(doc => doc.description === DocumentDescription.ProjectCompletionForm)) {
              ctx.addIssue({ code: ZodIssueCode.custom, params: { i18n: "errors.pcf_required" } });
            }
          }
        }),
    }),
    z.object({
      button_submit: z.literal("saveAndReturnToClaims"),
      status: z.string(),
      comments: z.string().max(1000),
    }),
  ]);

export type ClaimSummarySchema = z.output<ReturnType<typeof getClaimSummarySchema>>;
