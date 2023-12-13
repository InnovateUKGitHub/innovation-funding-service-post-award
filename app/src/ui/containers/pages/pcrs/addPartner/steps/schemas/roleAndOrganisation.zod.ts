import { z } from "zod";

export const roleAndOrganisationSchema = z.object({
  button_submit: z.string(),
  projectRole: z.coerce.number().gt(0),
  isCommercialWork: z.string(),
  partnerType: z.coerce.number().gt(0),
});

export type RoleAndOrganisationSchema = z.infer<typeof roleAndOrganisationSchema>;
