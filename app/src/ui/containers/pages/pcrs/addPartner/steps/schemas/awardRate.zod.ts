import { positiveNumberInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const getAwardRateSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        awardRate: positiveNumberInput,
      })
    : z.object({
        button_submit: z.string(),
        awardRate: positiveNumberInput.nullable(),
      });

export type AwardRateSchema = z.infer<ReturnType<typeof getAwardRateSchema>>;
