import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
import { parseCurrency } from "@framework/util/numberHelper";
import { makeZodI18nMap } from "@shared/zodi18n";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { getNumberValidation } from "@ui/zod/numericValidator.zod";
import {
  costCategoryIdValidation,
  costIdValidation,
  evaluateObject,
} from "@ui/zod/helperValidators/helperValidators.zod";
import { ZodIssueCode, z } from "zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner", "spendProfile"] });

const description = getTextValidation({ required: true, maxLength: 1_000 });
export const labourSchema = z.object({
  id: costIdValidation.nullable(),
  form: z.literal(FormTypes.PcrAddPartnerProjectCostLabour),
  labourDescription: description,
  grossCostOfRole: getGenericCurrencyValidation({
    required: true,
  }),
  ratePerDay: getGenericCurrencyValidation({
    required: true,
  }),
  daysSpentOnProject: getNumberValidation({
    max: 1_000_000,
    min: 0,
    integer: true,
    required: true,
  }),
  costCategoryType: z.nativeEnum(CostCategoryType),
  costCategoryId: costCategoryIdValidation,
});

export type LabourSchemaType = typeof labourSchema;
export type LabourSchema = z.infer<typeof labourSchema>;

export const overheadSchema = evaluateObject(
  (data: { overheadRate: PCRSpendProfileOverheadRate; button_submit: string }) => {
    return {
      id: costIdValidation.nullable(),
      form: z.literal(FormTypes.PcrAddPartnerSpendProfileOverheadCost),
      overheadRate: z.coerce.number().transform(x => x as PCRSpendProfileOverheadRate),
      calculatedValue: getGenericCurrencyValidation({
        required:
          Number(data.overheadRate) === PCRSpendProfileOverheadRate.Calculated && data.button_submit === "submit",
      }),
      button_submit: z.string(),
      costCategoryType: z.nativeEnum(CostCategoryType),
    };
  },
).superRefine((data, ctx) => {
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

export type OverheadSchemaType = typeof overheadSchema;
export type OverheadSchema = z.infer<typeof overheadSchema>;

export const overheadDocumentsSchema = z.object({
  form: z.literal(FormTypes.PcrAddPartnerSpendProfileOverheadDocuments),
});

export type OverheadDocumentsSchemaType = typeof overheadDocumentsSchema;
export type OverheadDocumentsSchema = z.infer<typeof overheadDocumentsSchema>;

export const materialsSchema = z.object({
  id: costIdValidation.nullable(),
  materialsDescription: description,
  costPerItem: getGenericCurrencyValidation({
    required: true,
  }),
  quantityOfMaterialItems: getNumberValidation({
    min: 0,
    max: 1_000_000,
    integer: true,
    required: true,
  }),
  form: z.literal(FormTypes.PcrAddPartnerSpendProfileMaterialsCost),
  costCategoryType: z.nativeEnum(CostCategoryType),
});

export type MaterialsSchemaType = typeof materialsSchema;
export type MaterialsSchema = z.infer<typeof materialsSchema>;

export const subcontractingSchema = z.object({
  id: costIdValidation.nullable(),
  subcontractorName: getTextValidation({ required: true, maxLength: 255 }),
  subcontractorCountry: getTextValidation({ required: true, maxLength: 255 }),
  subcontractorRoleAndDescription: getTextValidation({ required: true, maxLength: 32_000 }),
  subcontractorCost: getGenericCurrencyValidation({
    required: true,
  }),
  form: z.literal(FormTypes.PcrAddPartnerSpendProfileSubcontractingCost),
  costCategoryType: z.nativeEnum(CostCategoryType),
});

export type SubcontractingSchemaType = typeof subcontractingSchema;
export type SubcontractingSchema = z.infer<typeof subcontractingSchema>;

export const capitalUsageSchema = z.object({
  id: costIdValidation.nullable(),
  capitalUsageDescription: description,
  depreciationPeriod: getNumberValidation({
    integer: true,
    min: 0,
    required: true,
    max: 1_000_000,
  }),
  itemType: z.coerce.number().min(1),
  netPresentValue: getGenericCurrencyValidation({
    required: true,
  }),
  residualValue: getGenericCurrencyValidation({
    required: true,
  }),
  utilisation: getNumberValidation({ lt: 100, min: 0, required: true, decimalPlaces: 2 }),
  form: z.literal(FormTypes.PcrAddPartnerSpendProfileCapitalUsageCost),
  costCategoryType: z.nativeEnum(CostCategoryType),
});

export type CapitalUsageSchemaType = typeof capitalUsageSchema;
export type CapitalUsageSchema = z.infer<typeof capitalUsageSchema>;

const maxTotalCost = 10_000_000_000_000;

export const travelAndASubsistenceSchema = z
  .object({
    id: costIdValidation.nullable(),
    descriptionOfCost: description,
    numberOfTimes: getNumberValidation({ max: 1_000_000, min: 0, integer: true, required: true }),
    costOfEach: getGenericCurrencyValidation({
      required: true,
    }),
    totalCost: z.number(),
    form: z.literal(FormTypes.PcrAddPartnerSpendProfileTravelAndSubsistenceCost),
    costCategoryType: z.nativeEnum(CostCategoryType),
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

export type TravelAndSubsistenceSchemaType = typeof travelAndASubsistenceSchema;
export type TravelAndASubsistenceSchema = z.infer<typeof travelAndASubsistenceSchema>;

export const otherCostsSchema = z.object({
  id: costIdValidation.nullable(),
  otherCostDescription: getTextValidation({ required: true, maxLength: 32_000 }),
  estimatedCost: getGenericCurrencyValidation({
    required: true,
  }),
  form: z.literal(FormTypes.PcrAddPartnerProjectCostOtherCost),
  costCategoryType: z.nativeEnum(CostCategoryType),
  costCategoryId: costCategoryIdValidation,
});

export type OtherCostsSchemaType = typeof otherCostsSchema;
export type OtherCostsSchema = z.infer<typeof otherCostsSchema>;
