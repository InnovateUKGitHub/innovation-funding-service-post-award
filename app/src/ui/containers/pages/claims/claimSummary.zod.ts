import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { DocumentDescription } from "@framework/constants/documentDescription";

export const claimSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["claimSummary"] });

export const claimSummarySchema = z.discriminatedUnion("button_submit", [
  z.object({
    button_submit: z.literal("submit"),
    status: z.string(),
    comments: z.string().max(1000),
    documents: z
      .object({ description: z.nullable(z.number()).optional() })
      .array()
      .refine(x => x.some(doc => doc.description === DocumentDescription.IAR)),
  }),
  z.object({
    button_submit: z.literal("saveAndReturnToClaims"),
    status: z.string(),
    comments: z.string().max(1000),
  }),
]);
