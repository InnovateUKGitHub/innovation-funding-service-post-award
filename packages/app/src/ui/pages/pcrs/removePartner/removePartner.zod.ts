import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import {
  emptyStringToNullValidation,
  evaluateObject,
  partnerIdValidation,
} from "@ui/zod/helperValidators/helperValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { getNumberValidation } from "@ui/zod/numericValidator.zod";

export const removePartnerErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "removePartner"] });

export const removePartnerSchema = evaluateObject((data: { markedAsComplete: boolean; numberOfPeriods: number }) => ({
  markedAsComplete: z.boolean(),
  removalPeriod: getNumberValidation({
    integer: true,
    min: 1,
    max: data.numberOfPeriods,
    required: data.markedAsComplete,
  }),
  numberOfPeriods: z.number(),
  partnerId: data.markedAsComplete ? partnerIdValidation : z.union([emptyStringToNullValidation, partnerIdValidation]),
  form: z.union([z.literal(FormTypes.PcrRemovePartnerSummary), z.literal(FormTypes.PcrRemovePartnerStep)]),
}));

export type RemovePartnerSchema = typeof removePartnerSchema;
export type RemovePartnerSchemaType = z.infer<RemovePartnerSchema>;
