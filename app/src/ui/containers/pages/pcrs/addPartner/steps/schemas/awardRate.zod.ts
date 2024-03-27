import { percentageNumberInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const getAwardRateSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        awardRate: percentageNumberInput({ required: true }),
      })
    : z.object({
        button_submit: z.string(),
        awardRate: percentageNumberInput(),
      });

export type AwardRateSchema = z.infer<ReturnType<typeof getAwardRateSchema>>;
