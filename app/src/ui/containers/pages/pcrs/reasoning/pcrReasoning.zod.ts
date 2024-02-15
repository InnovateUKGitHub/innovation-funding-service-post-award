import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";

export const pcrReasoningErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "pcrReasoning"] });

const reasoningMaxChars = 32_000 as const;

export const pcrReasoningSchema = z
  .object({
    reasoningComments: z.string().max(reasoningMaxChars).optional(),
    markedAsCompleteHasBeenChecked: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.markedAsCompleteHasBeenChecked) {
      if (!data.reasoningComments) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: "required",
          },
          path: ["reasoningComments"],
        });
      }
    }
  });

export type PcrReasoningSchemaType = z.infer<typeof pcrReasoningSchema>;

export const pcrReasoningSummarySchema = z
  .object({
    reasoningComments: z.string(),
    reasoningStatus: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.reasoningStatus) {
      if (!data.reasoningComments) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: "required",
          },
          path: ["reasoningComments"],
        });
      }
    }
  });

export type PcrReasoningSummarySchemaType = z.infer<typeof pcrReasoningSummarySchema>;
