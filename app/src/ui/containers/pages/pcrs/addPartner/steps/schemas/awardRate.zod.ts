import { percentageNumberInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const getAwardRateSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        awardRate: percentageNumberInput(),
      })
    : z.object({
        button_submit: z.string(),
        awardRate: percentageNumberInput().nullable(),
      });

export type AwardRateSchema = z.infer<ReturnType<typeof getAwardRateSchema>>;
