import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { evaluateObject } from "@ui/zod/helperValidators/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";

export const scopeChangeErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "scopeChange"] });

export const pcrScopeChangeSchema = evaluateObject(data => ({
  form: z.literal(FormTypes.PcrChangeProjectScopeSummary),
  markedAsComplete: z.boolean(),
  projectSummary: getTextValidation({
    maxLength: 32_000,
    required: data.markedAsComplete,
  }),
  publicDescription: getTextValidation({
    maxLength: 32_000,
    required: data.markedAsComplete,
  }),
}));

export const getPcrScopeChangeProjectSummarySchema = (markedAsCompleteHasBeenChecked: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue),
    projectSummary: getTextValidation({
      maxLength: 32_000,
      required: markedAsCompleteHasBeenChecked,
    }),
  });

export const getPcrScopeChangePublicDescriptionSchema = (markedAsCompleteHasBeenChecked: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue),
    publicDescription: getTextValidation({
      maxLength: 32_000,
      required: markedAsCompleteHasBeenChecked,
    }),
  });

export type PcrScopeChangeSchemaType = typeof pcrScopeChangeSchema;
export type PcrScopeChangeProjectSummarySchemaType = ReturnType<typeof getPcrScopeChangeProjectSummarySchema>;
export type PcrScopeChangePublicDescriptionSchemaType = ReturnType<typeof getPcrScopeChangePublicDescriptionSchema>;
