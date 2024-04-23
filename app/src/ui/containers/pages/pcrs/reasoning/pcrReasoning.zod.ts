import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const pcrReasoningErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "pcrReasoning"] });

const reasoningMaxChars = 32_000 as const;

export const pcrReasoningSchema = z
  .object({
    reasoningComments: z.string().max(reasoningMaxChars).optional(),
    markedAsComplete: z.boolean(),
    form: z.literal(FormTypes.PcrPrepareReasoningStep),
  })
  .superRefine((data, ctx) => {
    if (data.markedAsComplete) {
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

export type PcrReasoningSchema = typeof pcrReasoningSchema;
export type PcrReasoningSchemaType = z.infer<PcrReasoningSchema>;

export const pcrReasoningFilesSchema = z.object({
  form: z.literal(FormTypes.PcrPrepareReasoningFilesStep),
});

export type PcrReasoningFilesSchema = typeof pcrReasoningFilesSchema;
export type PcrReasoningFilesSchemaType = z.infer<PcrReasoningFilesSchema>;

export const pcrReasoningSummarySchema = z
  .object({
    reasoningComments: z.string(),
    reasoningStatus: z.boolean(),
    form: z.literal(FormTypes.PcrPrepareReasoningSummary),
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

export type PcrReasoningSummarySchema = typeof pcrReasoningSummarySchema;
export type PcrReasoningSummarySchemaType = z.infer<typeof pcrReasoningSummarySchema>;
