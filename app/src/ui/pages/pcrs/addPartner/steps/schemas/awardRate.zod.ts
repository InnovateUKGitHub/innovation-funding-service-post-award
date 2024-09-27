import { FormTypes } from "@ui/zod/FormTypes";
import { percentageNumberInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const getAwardRateSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        form: z.literal(FormTypes.PcrAddPartnerAwardRateStep),
        markedAsComplete: z.string(),
        button_submit: z.string(),
        awardRate: percentageNumberInput({ required: true }),
      })
    : z.object({
        form: z.literal(FormTypes.PcrAddPartnerAwardRateStep),
        markedAsComplete: z.string(),
        button_submit: z.string(),
        awardRate: percentageNumberInput(),
      });

export type AwardRateSchemaType = ReturnType<typeof getAwardRateSchema>;
export type AwardRateSchema = z.infer<AwardRateSchemaType>;
