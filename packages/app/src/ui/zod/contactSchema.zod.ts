import { z } from "zod";
import { dateValidation, pclIdValidation } from "./helperValidators/helperValidators.zod";
import { makeZodI18nMap } from "@shared/zodi18n";

const contactSchemaErrorMap = makeZodI18nMap({ keyPrefix: ["contact"] });

const contactDtoSchema = z.object({
  id: pclIdValidation,
  associateStartDate: dateValidation.optional(),
  startDate: dateValidation.optional(),
  endDate: dateValidation.optional(),
  email: z.string().email().optional(),
  inactive: z.boolean().optional(),
  newTeamMember: z.boolean().optional(),
  sendInvitation: z.boolean().optional(),
  edited: z.boolean().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
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
