import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  evaluateObject,
  pcrIdValidation,
  pcrItemIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators.zod";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";

export const scopeChangeErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "scopeChange"] });

export const pcrScopeChangeSchema = evaluateObject(data => ({
  form: z.literal(FormTypes.PcrChangeProjectScopeSummary),
  projectId: projectIdValidation,
  pcrId: pcrIdValidation,
  pcrItemId: pcrItemIdValidation,
  markedAsComplete: z.boolean(),
  projectSummary: getTextareaValidation({
    label: "forms.pcr.scopeChange.projectSummary.label",
    maxLength: 32_000,
    required: data.markedAsComplete,
  }),
  publicDescription: getTextareaValidation({
    label: "forms.pcr.scopeChange.publicDescription.label",
    maxLength: 32_000,
    required: data.markedAsComplete,
  }),
}));

export const getPcrScopeChangeProjectSummarySchema = (markedAsComplete: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue),
    projectId: projectIdValidation,
    pcrId: pcrIdValidation,
    pcrItemId: pcrItemIdValidation,
    projectSummary: getTextareaValidation({
      label: "forms.pcr.scopeChange.projectSummary.label",
      maxLength: 32_000,
      required: markedAsComplete,
    }),
  });

export const getPcrScopeChangePublicDescriptionSchema = (markedAsComplete: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue),
    projectId: projectIdValidation,
    pcrId: pcrIdValidation,
    pcrItemId: pcrItemIdValidation,
    publicDescription: getTextareaValidation({
      label: "forms.pcr.scopeChange.publicDescription.label",
      maxLength: 32_000,
      required: markedAsComplete,
    }),
  });

export type PcrScopeChangeSchemaType = typeof pcrScopeChangeSchema;
export type PcrScopeChangeProjectSummarySchemaType = ReturnType<typeof getPcrScopeChangeProjectSummarySchema>;
export type PcrScopeChangePublicDescriptionSchemaType = ReturnType<typeof getPcrScopeChangePublicDescriptionSchema>;
