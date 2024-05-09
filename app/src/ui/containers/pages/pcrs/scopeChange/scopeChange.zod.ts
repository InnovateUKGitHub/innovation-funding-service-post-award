import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { pcrIdValidation, pcrItemIdValidation, projectIdValidation } from "@ui/zod/helperValidators.zod";

export const scopeChangeErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "scopeChange"] });

export const pcrScopeChangeSchema = z
  .object({
    form: z.literal(FormTypes.PcrChangeProjectScopeSummary),
    projectId: projectIdValidation,
    pcrId: pcrIdValidation,
    pcrItemId: pcrItemIdValidation,
    markedAsComplete: z.boolean(),
    projectSummary: z.string().max(32_000).optional(),
    publicDescription: z.string().max(32_000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.markedAsComplete) {
      if (!data.projectSummary) {
        ctx.addIssue({
          type: "string",
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          inclusive: true,
          path: ["projectSummary"],
        });
      }

      if (!data.publicDescription) {
        ctx.addIssue({
          type: "string",
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          inclusive: true,
          path: ["publicDescription"],
        });
      }
    }
  });

export const getPcrScopeChangeProjectSummarySchema = (markedAsComplete: boolean) =>
  z
    .object({
      form: z.literal(FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue),
      projectId: projectIdValidation,
      pcrId: pcrIdValidation,
      pcrItemId: pcrItemIdValidation,
      projectSummary: z.string().max(32_000),
    })
    .superRefine((data, ctx) => {
      if (markedAsComplete) {
        if (!data.projectSummary) {
          ctx.addIssue({
            type: "string",
            code: z.ZodIssueCode.too_small,
            minimum: 1,
            inclusive: true,
            path: ["projectSummary"],
          });
        }
      }
    });

export const getPcrScopeChangePublicDescriptionSchema = (markedAsComplete: boolean) =>
  z
    .object({
      form: z.literal(FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue),
      projectId: projectIdValidation,
      pcrId: pcrIdValidation,
      pcrItemId: pcrItemIdValidation,
      publicDescription: z.string().max(32_000),
    })
    .superRefine((data, ctx) => {
      if (markedAsComplete) {
        if (!data.publicDescription) {
          ctx.addIssue({
            type: "string",
            code: z.ZodIssueCode.too_small,
            minimum: 1,
            inclusive: true,
            path: ["publicDescription"],
          });
        }
      }
    });

export type PcrScopeChangeSchemaType = typeof pcrScopeChangeSchema;
export type PcrScopeChangeProjectSummarySchemaType = ReturnType<typeof getPcrScopeChangeProjectSummarySchema>;
export type PcrScopeChangePublicDescriptionSchemaType = ReturnType<typeof getPcrScopeChangePublicDescriptionSchema>;
