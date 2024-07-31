import { z } from "zod";
import { dateValidation, pclIdValidation } from "./helperValidators/helperValidators.zod";
import { makeZodI18nMap } from "@shared/zodi18n";

const contactSchemaErrorMap = makeZodI18nMap({ keyPrefix: ["contact"] });

const contactDtoSchema = z.object({
  id: pclIdValidation,
  associateStartDate: dateValidation,
});

const multipleContactDtoSchema = z.object({
  contacts: z.array(contactDtoSchema),
});

type MultipleContactDtoSchemaType = typeof multipleContactDtoSchema;
type ContactDtoSchemaType = typeof contactDtoSchema;

export {
  contactDtoSchema,
  multipleContactDtoSchema,
  contactSchemaErrorMap,
  ContactDtoSchemaType,
  MultipleContactDtoSchemaType,
};
