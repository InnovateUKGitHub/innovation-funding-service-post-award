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
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

const approveNewSubcontractorErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "approveNewSubcontractor"] });

const subcontractorNameMaxChars = 255 as const;
const subcontractorRegistrationNumberMaxChars = 20 as const;
const subcontractorRelationshipJustificationMaxChars = 16000 as const;
const subcontractorLocationMaxChars = 100 as const;
const subcontractorDescriptionMaxChars = 255 as const;
const subcontractorJustificationMaxChars = 32000 as const;

const approveNewSubcontractorSchema = evaluateObject(data => ({
  projectId: projectIdValidation,
  pcrId: pcrIdValidation,
  pcrItemId: pcrItemIdValidation,
  form: z.union([
    z.literal(FormTypes.PcrApproveNewSubcontractorStep),
    z.literal(FormTypes.PcrApproveNewSubcontractorSummary),
  ]),
  subcontractorName: getTextareaValidation({ required: data.markedAsComplete, maxLength: subcontractorNameMaxChars }),
  subcontractorRegistrationNumber: getTextareaValidation({
    required: data.markedAsComplete,
    maxLength: subcontractorRegistrationNumberMaxChars,
  }),
  subcontractorRelationship: booleanValidation,
  subcontractorRelationshipJustification: getTextareaValidation({
    required: data.markedAsComplete && data.subcontractorRelationship,
    maxLength: subcontractorRelationshipJustificationMaxChars,
  }),
  subcontractorLocation: getTextareaValidation({
    required: data.markedAsComplete,
    maxLength: subcontractorLocationMaxChars,
  }),
  subcontractorDescription: getTextareaValidation({
    required: data.markedAsComplete,
    maxLength: subcontractorDescriptionMaxChars,
  }),
  subcontractorJustification: getTextareaValidation({
    required: data.markedAsComplete,
    maxLength: subcontractorJustificationMaxChars,
  }),
  subcontractorCost: getGenericCurrencyValidation({
    required: data.markedAsComplete,
  }),
  markedAsComplete: z.boolean(),
}));

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
