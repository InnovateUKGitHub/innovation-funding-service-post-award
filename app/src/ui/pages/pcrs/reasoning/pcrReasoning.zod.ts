import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { evaluateObject } from "@ui/zod/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const pcrReasoningErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "pcrReasoning"] });

const reasoningMaxChars = 32_000 as const;

export const pcrReasoningSchema = evaluateObject((data: { markedAsComplete: boolean }) => ({
  reasoningComments: getTextValidation({
    maxLength: reasoningMaxChars,
    required: data.markedAsComplete,
  }),
  markedAsComplete: z.boolean(),
  form: z.literal(FormTypes.PcrPrepareReasoningStep),
}));

export type PcrReasoningSchema = typeof pcrReasoningSchema;
export type PcrReasoningSchemaType = z.infer<PcrReasoningSchema>;

export const pcrReasoningFilesSchema = z.object({
  form: z.literal(FormTypes.PcrPrepareReasoningFilesStep),
});

export type PcrReasoningFilesSchema = typeof pcrReasoningFilesSchema;
export type PcrReasoningFilesSchemaType = z.infer<PcrReasoningFilesSchema>;

export const pcrReasoningSummarySchema = evaluateObject((data: { reasoningStatus: boolean }) => ({
  reasoningComments: getTextValidation({
    maxLength: reasoningMaxChars,
    required: data.reasoningStatus,
  }),
  reasoningStatus: z.boolean(),
  form: z.literal(FormTypes.PcrPrepareReasoningSummary),
}));

export type PcrReasoningSummarySchema = typeof pcrReasoningSummarySchema;
export type PcrReasoningSummarySchemaType = z.infer<typeof pcrReasoningSummarySchema>;
