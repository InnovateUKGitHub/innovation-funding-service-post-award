import { CostCategoryType } from "@framework/constants/enums";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const getAcademicCostsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        form: z.literal(FormTypes.PcrAddPartnerAcademicCostsStep),
        markedAsComplete: z.string(),
        button_submit: z.string(),
        tsbReference: z.string().min(1),
        costs: z.array(
          z.object({
            value: getGenericCurrencyValidation({
              label: "forms.pcr.addPartner.costs.arrayType.value.label",
              required: true,
            }),
            costCategoryId: z.string(),
            id: z.string(),
            description: z.string(),
            costCategory: z.number().transform(x => x as CostCategoryType),
          }),
        ),
      })
    : z.object({
        form: z.literal(FormTypes.PcrAddPartnerAcademicCostsStep),
        button_submit: z.string(),
        markedAsComplete: z.string(),
        tsbReference: z.string(),
        costs: z.array(
          z.object({
            value: getGenericCurrencyValidation({
              label: "forms.pcr.addPartner.costs.arrayType.value.label",
              required: true,
            }),
            costCategoryId: z.string(),
            id: z.string(),
            description: z.string(),
            costCategory: z.number().transform(x => x as CostCategoryType),
          }),
        ),
      });

export type AcademicCostsSchemaType = ReturnType<typeof getAcademicCostsSchema>;
export type AcademicCostsSchema = z.infer<AcademicCostsSchemaType>;
