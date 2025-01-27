import { CostCategoryType } from "@framework/constants/enums";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { costCategoryIdValidation, costIdValidation } from "@ui/zod/helperValidators/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const getAcademicCostsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        form: z.literal(FormTypes.PcrAddPartnerAcademicCostsStep),
        markedAsComplete: z.boolean(),
        button_submit: z.string(),
        tsbReference: getTextValidation({
          required: true,
          maxLength: 256,
        }),
        costs: z.array(
          z.object({
            value: getGenericCurrencyValidation({
              required: true,
            }),
            costCategoryId: costCategoryIdValidation,
            id: z.union([costIdValidation.optional(), z.literal("")]),
            description: z.string(),
            costCategory: z.number().transform(x => x as CostCategoryType),
          }),
        ),
      })
    : z.object({
        form: z.literal(FormTypes.PcrAddPartnerAcademicCostsStep),
        button_submit: z.string(),
        markedAsComplete: z.boolean(),
        tsbReference: getTextValidation({
          required: false,
          maxLength: 256,
        }),
        costs: z.array(
          z.object({
            value: getGenericCurrencyValidation({
              required: true,
            }),
            costCategoryId: costCategoryIdValidation,
            id: z.union([costIdValidation.optional(), z.literal("")]),
            description: z.string(),
            costCategory: z.number().transform(x => x as CostCategoryType),
          }),
        ),
      });

export type AcademicCostsSchemaType = ReturnType<typeof getAcademicCostsSchema>;
export type AcademicCostsSchema = z.infer<AcademicCostsSchemaType>;
