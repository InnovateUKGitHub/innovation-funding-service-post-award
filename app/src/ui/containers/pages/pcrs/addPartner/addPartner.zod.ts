import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { isEmptyDate, isValidMonth, isValidYear } from "@framework/validation-helpers/date";
import { PCRProjectLocation } from "@framework/constants/pcrConstants";

export const roleAndOrganisationErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner", "roleAndOrganisation"] });

const common = {
  button_submit: z.string(),
  markedAsComplete: z.boolean(),
};

export const roleAndOrganisationSchema = z.object({
  ...common,
  projectRole: z.coerce.number().gt(0),
  isCommercialWork: z.string(),
  partnerType: z.coerce.number().gt(0),
});

export type RoleAndOrganisationSchema = z.infer<typeof roleAndOrganisationSchema>;

export const academicOrganisationErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "academicOrganisation"],
});

export const academicOrganisationSchema = z.object({
  ...common,
  organisationName: z.string(),
});

export type AcademicOrganisationSchema = z.infer<typeof academicOrganisationSchema>;

export const academicCostsErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "academicCosts"],
});

export const academicCostsSchema = z.object({
  ...common,
  tsbReference: z.string(),
  costs: z.array(
    z.object({
      value: z.coerce.number(),
    }),
  ),
});

export type AcademicCostsSchema = z.infer<typeof academicCostsSchema>;

export const projectLocationErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "projectLocation"],
});

export const projectLocationSchema = z.object({
  ...common,
  projectLocation: z.string(),
  projectCity: z.string(),
  projectPostcode: z.string(),
});

export type ProjectLocationSchema = z.infer<typeof projectLocationSchema>;

export const financeContactErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "financeContact"],
});

export const financeContactSchema = z.object({
  ...common,
  contact1Email: z.string(),
  contact1Forename: z.string(),
  contact1Surname: z.string(),
  contact1Phone: z.string(),
});

export type FinanceContactSchema = z.infer<typeof financeContactSchema>;

export const projectManagerErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "projectManager"],
});

export const projectManagerSchema = z.object({
  ...common,
  contact2Email: z.string(),
  contact2Forename: z.string(),
  contact2Surname: z.string(),
  contact2Phone: z.string(),
});

export type ProjectManagerSchema = z.infer<typeof projectManagerSchema>;

export const companiesHouseErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "companiesHouse"],
});

export const companiesHouseSchema = z.object({
  ...common,
  organisationName: z.string(),
  registrationNumber: z.string(),
  registeredAddress: z.string(),
  searchResults: z.string(),
});

export type CompaniesHouseSchema = z.infer<typeof companiesHouseSchema>;

export const organisationDetailsErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "organisationDetails"],
});

export const organisationDetailsSchema = z.object({
  ...common,
  participantSize: z.coerce.number(),
  numberOfEmployees: z.coerce.number().nullable(),
});

export type OrganisationDetailsSchema = z.infer<typeof organisationDetailsSchema>;

export const awardRateErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "awardRate"],
});

export const awardRateSchema = z.object({
  ...common,
  awardRate: z.coerce.number().nullable(),
});

export type AwardRateSchema = z.infer<typeof awardRateSchema>;

export const otherFundingErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "otherFunding"],
});

export const otherFundingSchema = z.object({
  ...common,
  hasOtherFunding: z.string().nullable(),
});

export type OtherFundingSchema = z.infer<typeof otherFundingSchema>;

export const otherSourcesOfFundingErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "otherSourcesOfFunding"],
});

export const otherSourcesOfFundingSchema = z.object({
  ...common,
  itemsLength: z.string(),
  funds: z.array(
    z.object({
      value: z.coerce.number().nullable(),
      description: z.string(),
      dateSecured_month: z.string().nullable(),
      dateSecured_year: z.string().nullable(),
    }),
  ),
});

export type OtherSourcesOfFundingSchema = z.infer<typeof otherSourcesOfFundingSchema>;

export const spendProfileErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "spendProfile"],
});

export const spendProfileSchema = z.object({
  ...common,
  // itemsLength: z.string(),
  // funds: z.array(
  //   z.object({
  //     value: z.coerce.number().nullable(),
  //     description: z.string(),
  //     dateSecured_month: z.string().nullable(),
  //     dateSecured_year: z.string().nullable(),
  //   }),
  // ),
});

export type SpendProfileSchema = z.infer<typeof spendProfileSchema>;

export const financeDetailsErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "financeDetails"],
});

export const financeDetailsSchema = z
  .object({
    ...common,
    financialYearEndTurnover: z.coerce.number().nullable(),
    financialYearEndDate_month: z.string().optional(),
    financialYearEndDate_year: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!isEmptyDate(data.financialYearEndDate_month, data.financialYearEndDate_year)) {
      if (!isValidMonth(data.financialYearEndDate_month) || !isValidYear(data.financialYearEndDate_year)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["financialYearEndDate"],
        });
      }
    }
  });

export type FinanceDetailsSchema = z.infer<typeof financeDetailsSchema>;

export const addPartnerErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner"],
});
export const addPartnerSchema = z.object({
  ...common,
  awardRate: z.number().nullable(),
  contact1Email: z.string().nullable(),
  contact1Forename: z.string().nullable(),
  contact1Phone: z.string().nullable(),
  contact1Surname: z.string().nullable(),
  contact2Email: z.string().nullable(),
  contact2Forename: z.string().nullable(),
  contact2Phone: z.string().nullable(),
  contact2Surname: z.string().nullable(),
  financialYearEndDate: z.date().nullable(),
  financialYearEndTurnover: z.number().nullable(),
  hasOtherFunding: z.string().nullable(),
  isCommercialWork: z.boolean().nullable(),
  numberOfEmployees: z.coerce.number().nullable(),
  organisationName: z.string().nullable(),
  participantSize: z.coerce.number().nullable(),
  partnerType: z.coerce.number().gt(0).nullable(),
  projectCity: z.string().nullable(),
  projectLocation: z.coerce
    .number()
    .transform(x => x as PCRProjectLocation)
    .nullable(),
  projectPostcode: z.string().nullable(),
  projectRole: z.coerce.number().gt(0).nullable(),
  registeredAddress: z.string().nullable(),
  registrationNumber: z.string().nullable(),
  tsbReference: z.string().nullable(),
});

export type AddPartnerSchema = z.infer<typeof addPartnerSchema>;
