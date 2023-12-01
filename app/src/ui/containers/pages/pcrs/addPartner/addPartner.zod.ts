import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { isEmptyDate, isValidMonth, isValidYear } from "@framework/validation-helpers/date";

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
  awardRate: z.number().nullable(),
});

export type AwardRateSchema = z.infer<typeof awardRateSchema>;

export const otherFundingErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "otherFunding"],
});

export const otherFundingSchema = z.object({
  ...common,
  hasOtherFunding: z.boolean().nullable(),
});

export type OtherFundingSchema = z.infer<typeof otherFundingSchema>;

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
