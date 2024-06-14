import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import {
  booleanValidation,
  evaluateObject,
  pcrIdValidation,
  pcrItemIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators.zod";
import { z } from "zod";

const approveNewSubcontractorErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "approveNewSubcontractor"] });

const subcontractorNameMaxChars = 255 as const;
const subcontractorRegistrationNumberMaxChars = 20 as const;
const subcontractorRelationshipJustificationMaxChars = 16000 as const;
const subcontractorLocationMaxChars = 100 as const;
const subcontractorDescriptionMaxChars = 255 as const;
const subcontractorJustificationMaxChars = 32000 as const;

const approveNewSubcontractorSchema = evaluateObject((data: { markedAsComplete: boolean }) => ({
  projectId: projectIdValidation,
  pcrId: pcrIdValidation,
  pcrItemId: pcrItemIdValidation,
  form: z.union([
    z.literal(FormTypes.PcrApproveNewSubcontractorStep),
    z.literal(FormTypes.PcrApproveNewSubcontractorSummary),
  ]),
  subcontractorName: z.string().max(subcontractorNameMaxChars),
  subcontractorRegistrationNumber: z.string().max(subcontractorRegistrationNumberMaxChars),
  subcontractorRelationship: booleanValidation,
  subcontractorRelationshipJustification: z.string(),
  subcontractorLocation: z.string().max(subcontractorLocationMaxChars),
  subcontractorDescription: z.string().max(subcontractorDescriptionMaxChars),
  subcontractorJustification: z.string().max(subcontractorJustificationMaxChars),
  subcontractorCost: getGenericCurrencyValidation({
    label: "forms.pcr.approveNewSubcontractor.subcontractorCost.label",
    required: data.markedAsComplete,
  }),
  markedAsComplete: z.boolean(),
})).superRefine((data, ctx) => {
  if (data.markedAsComplete) {
    const checkIfFalsy = <T extends keyof typeof data>(key: T, value: unknown) => {
      if (!value) {
        ctx.addIssue({
          type: "string",
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          inclusive: true,
          path: [key],
        });
      }
    };

    checkIfFalsy("subcontractorName", data.subcontractorName);
    checkIfFalsy("subcontractorRegistrationNumber", data.subcontractorRegistrationNumber);
    checkIfFalsy("subcontractorLocation", data.subcontractorLocation);
    checkIfFalsy("subcontractorDescription", data.subcontractorDescription);
    checkIfFalsy("subcontractorJustification", data.subcontractorJustification);
    if (data.subcontractorRelationship) {
      checkIfFalsy("subcontractorRelationshipJustification", data.subcontractorRelationshipJustification);
    }
  }

  if (data.subcontractorRelationship) {
    if (data.subcontractorRelationshipJustification.length > subcontractorRelationshipJustificationMaxChars) {
      ctx.addIssue({
        type: "string",
        code: z.ZodIssueCode.too_big,
        maximum: subcontractorRelationshipJustificationMaxChars,
        inclusive: true,
        path: ["subcontractorRelationshipJustification"],
      });
    }
  }
});

type ApproveNewSubcontractorSchemaType = typeof approveNewSubcontractorSchema;

export {
  approveNewSubcontractorSchema,
  ApproveNewSubcontractorSchemaType,
  approveNewSubcontractorErrorMap,
  subcontractorNameMaxChars,
  subcontractorRegistrationNumberMaxChars,
  subcontractorRelationshipJustificationMaxChars,
  subcontractorLocationMaxChars,
  subcontractorDescriptionMaxChars,
  subcontractorJustificationMaxChars,
};
