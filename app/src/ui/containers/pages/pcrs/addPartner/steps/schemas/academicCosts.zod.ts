import { CostCategoryType } from "@framework/constants/enums";
import { z } from "zod";

const lineItemValue = z.string().regex(/^-?[0-9]{1,16}(\.[0-9]{1,2})?$/i);

export const getAcademicCostsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        tsbReference: z.string().min(1),
        costs: z.array(
          z.object({
            value: lineItemValue,
            costCategoryId: z.string(),
            id: z.string(),
            description: z.string(),
            costCategory: z.number().transform(x => x as CostCategoryType),
          }),
        ),
      })
    : z.object({
        button_submit: z.string(),
        tsbReference: z.string(),
        costs: z.array(
          z.object({
            value: lineItemValue,
            costCategoryId: z.string(),
            id: z.string(),
            description: z.string(),
            costCategory: z.number().transform(x => x as CostCategoryType),
          }),
        ),
      });

export type AcademicCostsSchema = z.infer<ReturnType<typeof getAcademicCostsSchema>>;
