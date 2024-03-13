import { CostCategoryType } from "@framework/constants/enums";
import { currencyValidation } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const getAcademicCostsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        tsbReference: z.string().min(1),
        costs: z.array(
          z.object({
            value: currencyValidation,
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
            value: currencyValidation,
            costCategoryId: z.string(),
            id: z.string(),
            description: z.string(),
            costCategory: z.number().transform(x => x as CostCategoryType),
          }),
        ),
      });

export type AcademicCostsSchema = z.infer<ReturnType<typeof getAcademicCostsSchema>>;
