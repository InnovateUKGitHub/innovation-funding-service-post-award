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
