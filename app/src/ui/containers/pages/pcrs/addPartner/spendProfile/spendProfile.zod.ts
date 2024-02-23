import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
import { makeZodI18nMap } from "@shared/zodi18n";
import { currencyValidation, percentageNumberInput, requiredPositiveIntegerInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner", "spendProfile"] });

const idValidation = z
  .string()
  .transform(x => x as PcrId)
  .nullable();

const description = z.string().min(1).max(255);

export const labourSchema = z.object({
  id: idValidation,
  descriptionOfRole: description,
  grossCostOfRole: currencyValidation,
  ratePerDay: currencyValidation,
  daysSpentOnProject: requiredPositiveIntegerInput({ max: 1000000 }),
});

export type LabourSchema = z.infer<typeof labourSchema>;

export const overheadSchema = z
  .object({
    id: idValidation,
    overheadRate: z.coerce.number().transform(x => x as PCRSpendProfileOverheadRate),
    calculatedValue: currencyValidation.nullable(),
    button_submit: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.overheadRate === PCRSpendProfileOverheadRate.Calculated) {
      if (!data.calculatedValue) {
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
  id: idValidation,
  materialsDescription: description,
  costPerItem: currencyValidation,
  quantityOfMaterialItems: requiredPositiveIntegerInput({ min: 0 }),
});

export type MaterialsSchema = z.infer<typeof materialsSchema>;

export const subcontractingSchema = z.object({
  id: idValidation,
  subcontractorName: z.string().min(1),
  subcontractorCountry: z.string().min(1),
  subcontractorRoleAndDescription: z.string().min(1),
  subcontractorCost: currencyValidation,
});

export type SubcontractingSchema = z.infer<typeof subcontractingSchema>;

export const capitalUsageSchema = z.object({
  id: idValidation,
  capitalUsageDescription: description,
  depreciationPeriod: requiredPositiveIntegerInput({}),
  itemType: z.coerce.number().min(1),
  netPresentValue: currencyValidation,
  residualValue: currencyValidation,
  utilisation: percentageNumberInput({ max: 99.99, min: 0, required: true }),
});

export type CapitalUsageSchema = z.infer<typeof capitalUsageSchema>;

export const travelAndASubsistenceSchema = z.object({
  id: idValidation,
  descriptionOfCost: description,
  numberOfTimes: requiredPositiveIntegerInput({ max: 1_000_000 }),
  costOfEach: currencyValidation,
});

export type TravelAndASubsistenceSchema = z.infer<typeof travelAndASubsistenceSchema>;

export const otherCostsSchema = z.object({
  id: idValidation,
  descriptionOfCost: description,
  estimatedCost: currencyValidation,
});

export type OtherCostsSchema = z.infer<typeof otherCostsSchema>;
