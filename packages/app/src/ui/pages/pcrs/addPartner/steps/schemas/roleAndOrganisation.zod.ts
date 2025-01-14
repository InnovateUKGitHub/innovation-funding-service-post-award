import { PCRPartnerType } from "@framework/constants/pcrConstants";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const roleAndOrganisationSchema = z.object({
  form: z.literal(FormTypes.PcrAddPartnerRoleAndOrganisationStep),
  button_submit: z.string(),
  projectRole: z.coerce.number().gt(0),
  isCommercialWork: z.string(),
  partnerType: z.coerce
    .number()
    .gt(0)
    .transform(x => x as PCRPartnerType),
});

export type RoleAndOrganisationSchemaType = typeof roleAndOrganisationSchema;

export type RoleAndOrganisationSchema = z.infer<RoleAndOrganisationSchemaType>;
