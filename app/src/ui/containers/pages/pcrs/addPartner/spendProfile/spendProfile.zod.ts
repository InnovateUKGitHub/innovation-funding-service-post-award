import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
import { parseCurrency } from "@framework/util/numberHelper";
import { makeZodI18nMap } from "@shared/zodi18n";
import {
  costIdValidation,
  currencyValidation,
  percentageNumberInput,
  requiredPositiveIntegerInput,
} from "@ui/zod/helperValidators.zod";
import { ZodIssueCode, z } from "zod";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner", "spendProfile"] });

const description = z.string().min(1).max(131072);

export const labourSchema = z.object({
  id: costIdValidation.nullable(),
  descriptionOfRole: description,
  grossCostOfRole: currencyValidation,
  ratePerDay: currencyValidation,
  daysSpentOnProject: requiredPositiveIntegerInput({ max: 1000000 }),
});

export type LabourSchema = z.infer<typeof labourSchema>;

export const overheadSchema = z
  .object({
    id: costIdValidation.nullable(),
    overheadRate: z.coerce.number().transform(x => x as PCRSpendProfileOverheadRate),
    calculatedValue: z.union([currencyValidation.nullable().optional(), z.literal(""), z.string().regex(/^\s+$/)]),
    button_submit: z.string(),
  })
  .superRefine((data, ctx) => {
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
    } else if (data.overheadRate === PCRSpendProfileOverheadRate.Calculated) {
      if (
        !(typeof data.calculatedValue === "string" && data.calculatedValue.trim().length > 0) &&
        data.button_submit === "submit"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 0,
          inclusive: false,
          type: "number",
          path: ["calculatedValue"],
        });
      }
    }
  });

export type OverheadSchema = z.infer<typeof overheadSchema>;

export const materialsSchema = z.object({
  id: costIdValidation.nullable(),
  materialsDescription: description,
  costPerItem: currencyValidation,
  quantityOfMaterialItems: requiredPositiveIntegerInput({ min: 0 }),
});

export type MaterialsSchema = z.infer<typeof materialsSchema>;

export const subcontractingSchema = z.object({
  id: costIdValidation.nullable(),
  subcontractorName: z.string().min(1).max(255),
  subcontractorCountry: z.string().min(1).max(255),
  subcontractorRoleAndDescription: description,
  subcontractorCost: currencyValidation,
});

export type SubcontractingSchema = z.infer<typeof subcontractingSchema>;

export const capitalUsageSchema = z.object({
  id: costIdValidation.nullable(),
  capitalUsageDescription: description,
  depreciationPeriod: requiredPositiveIntegerInput({}),
  itemType: z.coerce.number().min(1),
  netPresentValue: currencyValidation,
  residualValue: currencyValidation,
  utilisation: percentageNumberInput({ max: 99.99, min: 0, required: true }),
});

export type CapitalUsageSchema = z.infer<typeof capitalUsageSchema>;

const maxTotalCost = 10_000_000_000_000;

export const travelAndASubsistenceSchema = z
  .object({
    id: costIdValidation.nullable(),
    descriptionOfCost: description,
    numberOfTimes: requiredPositiveIntegerInput({ max: 9_999_999_999 }),
    costOfEach: currencyValidation,
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
  estimatedCost: currencyValidation,
});

export type OtherCostsSchema = z.infer<typeof otherCostsSchema>;
