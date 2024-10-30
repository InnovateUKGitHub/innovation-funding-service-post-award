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

export const getRemovePartnerSchema = (numberOfPeriods: number) =>
  evaluateObject((data: { markedAsComplete: boolean }) => ({
    markedAsComplete: z.boolean(),
    removalPeriod: getNumberValidation({
      integer: true,
      min: 1,
      max: numberOfPeriods,
      required: data.markedAsComplete,
    }),
    partnerId: data.markedAsComplete
      ? partnerIdValidation
      : z.union([emptyStringToNullValidation, partnerIdValidation]),
    form: z.union([z.literal(FormTypes.PcrRemovePartnerSummary), z.literal(FormTypes.PcrRemovePartnerStep)]),
  }));

export type RemovePartnerSchema = ReturnType<typeof getRemovePartnerSchema>;
export type RemovePartnerSchemaType = z.infer<RemovePartnerSchema>;
