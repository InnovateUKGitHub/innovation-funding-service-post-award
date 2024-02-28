import { makeZodI18nMap } from "@shared/zodi18n";
import { dateValidation, pclIdValidation } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

const contactSetupAssociateErrorMap = makeZodI18nMap({ keyPrefix: ["setup", "contactSetupAssociate"] });

const contactSetupAssociateSchema = z.object({
  contacts: z.record(
    pclIdValidation,
    z.object({
      startDate: dateValidation,
    }),
  ),
});

type ContactSetupAssociateSchemaType = typeof contactSetupAssociateSchema;

export { contactSetupAssociateSchema, contactSetupAssociateErrorMap, ContactSetupAssociateSchemaType };
