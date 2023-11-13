import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner", "roleAndOrganisation"] });

export const roleAndOrganisationSchema = z.object({
  button_submit: z.string(),
  markedAsComplete: z.boolean(),
  projectRole: z.coerce.number().gt(0),
  isCommercialWork: z.string(),
  partnerType: z.coerce.number().gt(0),
});

export type RoleAndOrganisationSchema = z.infer<typeof roleAndOrganisationSchema>;
