import { FormTypes } from "@ui/zod/FormTypes";
import { getNumberValidation } from "@ui/zod/numericValidator.zod";
import { z } from "zod";

export const getAwardRateSchema = (markedAsComplete: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrAddPartnerAwardRateStep),
    markedAsComplete: z.string(),
    button_submit: z.string(),
    awardRate: getNumberValidation({ min: 0, max: 100, required: markedAsComplete, decimalPlaces: 2 }),
  });

export type AwardRateSchemaType = ReturnType<typeof getAwardRateSchema>;
export type AwardRateSchema = z.infer<AwardRateSchemaType>;
