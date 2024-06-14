import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
import { parseCurrency } from "@framework/util/numberHelper";
import { makeZodI18nMap } from "@shared/zodi18n";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import {
  costIdValidation,
  evaluateObject,
  percentageNumberInput,
  requiredPositiveIntegerInput,
} from "@ui/zod/helperValidators.zod";
import { ZodIssueCode, z } from "zod";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner", "spendProfile"] });

const description = z.string().min(1).max(131072);

export const labourSchema = z.object({
  id: costIdValidation.nullable(),
  descriptionOfRole: description,
  grossCostOfRole: getGenericCurrencyValidation({
    label: "forms.pcr.addPartner.spendProfile.grossCostOfRole.label",
    required: true,
  }),
  ratePerDay: getGenericCurrencyValidation({
    label: "forms.pcr.addPartner.spendProfile.ratePerDay.label",
    required: true,
  }),
  daysSpentOnProject: requiredPositiveIntegerInput({ max: 1000000 }),
});

export type LabourSchema = z.infer<typeof labourSchema>;

export const overheadSchema = evaluateObject((data: { overheadRate: PCRSpendProfileOverheadRate }) => {
  return {
    id: costIdValidation.nullable(),
    overheadRate: z.coerce.number().transform(x => x as PCRSpendProfileOverheadRate),
    calculatedValue: getGenericCurrencyValidation({
      label: "forms.pcr.addPartner.spendProfile.calculatedValue.label",
      required: Number(data.overheadRate) === PCRSpendProfileOverheadRate.Calculated,
    }),
    button_submit: z.string(),
  };
}).superRefine((data, ctx) => {
  if (data.overheadRate === PCRSpendProfileOverheadRate.Unknown) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_enum_value,
      options: [
        PCRSpendProfileOverheadRate.Zero,
        PCRSpendProfileOverheadRate.Twenty,
        PCRSpendProfileOverheadRate.Calculated,
      ],
      received: PCRSpendProfileOverheadRate.Unknown,
      path: ["overheadRate"],
    });
  }
});

export type OverheadSchema = z.infer<typeof overheadSchema>;

export const materialsSchema = z.object({
  id: costIdValidation.nullable(),
  materialsDescription: description,
  costPerItem: getGenericCurrencyValidation({
    label: "forms.pcr.addPartner.spendProfile.costPerItem.label",
    required: true,
  }),
  quantityOfMaterialItems: requiredPositiveIntegerInput({ min: 0 }),
});

export type MaterialsSchema = z.infer<typeof materialsSchema>;

export const subcontractingSchema = z.object({
  id: costIdValidation.nullable(),
  subcontractorName: z.string().min(1).max(255),
  subcontractorCountry: z.string().min(1).max(255),
  subcontractorRoleAndDescription: description,
  subcontractorCost: getGenericCurrencyValidation({
    label: "forms.pcr.addPartner.spendProfile.subcontractorCost.label",
    required: true,
  }),
});

export type SubcontractingSchema = z.infer<typeof subcontractingSchema>;

export const capitalUsageSchema = z.object({
  id: costIdValidation.nullable(),
  capitalUsageDescription: description,
  depreciationPeriod: requiredPositiveIntegerInput({}),
  itemType: z.coerce.number().min(1),
  netPresentValue: getGenericCurrencyValidation({
    label: "forms.pcr.addPartner.spendProfile.netPresentValue.label",
    required: true,
  }),
  residualValue: getGenericCurrencyValidation({
    label: "forms.pcr.addPartner.spendProfile.residualValue.label",
    required: true,
  }),
  utilisation: percentageNumberInput({ max: 99.99, min: 0, required: true }),
});

export type CapitalUsageSchema = z.infer<typeof capitalUsageSchema>;

const maxTotalCost = 10_000_000_000_000;

export const travelAndASubsistenceSchema = z
  .object({
    id: costIdValidation.nullable(),
    descriptionOfCost: description,
    numberOfTimes: requiredPositiveIntegerInput({ max: 9_999_999_999 }),
    costOfEach: getGenericCurrencyValidation({
      label: "forms.pcr.addPartner.spendProfile.costOfEach.label",
      required: true,
    }),
    totalCost: z.number(),
  })
  .superRefine((data, ctx) => {
    const totalCost = data.numberOfTimes * parseCurrency(data.costOfEach);
    if (totalCost >= maxTotalCost) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        inclusive: false,
        maximum: maxTotalCost,
        type: "number",
        path: ["totalCost"],
      });
    }
  });

export type TravelAndASubsistenceSchema = z.infer<typeof travelAndASubsistenceSchema>;

export const otherCostsSchema = z.object({
  id: costIdValidation.nullable(),
  descriptionOfCost: description,
  estimatedCost: getGenericCurrencyValidation({
    label: "forms.pcr.addPartner.spendProfile.estimatedCost.label",
    required: true,
  }),
});

export type OtherCostsSchema = z.infer<typeof otherCostsSchema>;
