import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

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
