import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const roleAndOrganisationErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner", "roleAndOrganisation"] });

export const roleAndOrganisationSchema = z.object({
  button_submit: z.string(),
  markedAsComplete: z.boolean(),
  projectRole: z.coerce.number().gt(0),
  isCommercialWork: z.string(),
  partnerType: z.coerce.number().gt(0),
});

export type RoleAndOrganisationSchema = z.infer<typeof roleAndOrganisationSchema>;

export const academicOrganisationErrorMap = makeZodI18nMap({
  keyPrefix: ["pcr", "addPartner", "academicOrganisation"],
});

export const academicOrganisationSchema = z.object({
  button_submit: z.string(),
  markedAsComplete: z.boolean(),
  organisationName: z.string(),
});

export type AcademicOrganisationSchema = z.infer<typeof academicOrganisationSchema>;
