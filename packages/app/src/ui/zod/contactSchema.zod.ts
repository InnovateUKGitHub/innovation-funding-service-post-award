import { z } from "zod";
import { evaluateObject, getDateValidation, pclIdValidation } from "./helperValidators/helperValidators.zod";
import { makeZodI18nMap } from "@shared/zodi18n";

const contactSchemaErrorMap = makeZodI18nMap({ keyPrefix: ["contact"] });

const contactDtoSchema = evaluateObject(data => ({
  id: pclIdValidation,
  associateStartDate: getDateValidation().optional(),
  associateEndDate: getDateValidation({ minimum: data.associateStartDate ?? undefined }).optional(),
  startDate: getDateValidation().optional(),
  endDate: getDateValidation().optional(),
  email: z.string().email().optional(),
  inactive: z.boolean().optional(),
  newTeamMember: z.boolean().optional(),
  sendInvitation: z.boolean().optional(),
  edited: z.boolean().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}));

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
