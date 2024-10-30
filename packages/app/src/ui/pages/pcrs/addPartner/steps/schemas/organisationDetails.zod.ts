import { FormTypes } from "@ui/zod/FormTypes";
import { getNumberValidation } from "@ui/zod/numericValidator.zod";
import { z } from "zod";

const employeesLessThan = 100_000_000;

export const getOrganisationDetailsSchema = (markedAsComplete: boolean) =>
  z.object({
    markedAsComplete: z.string(),
    form: z.literal(FormTypes.PcrAddPartnerOrganisationDetailsStep),
    button_submit: z.string(),
    participantSize: z.coerce.number().gt(0),
    numberOfEmployees: getNumberValidation({
      lt: employeesLessThan,
      required: markedAsComplete,
      integer: true,
    }),
  });

export type OrganisationDetailsSchemaType = ReturnType<typeof getOrganisationDetailsSchema>;
export type OrganisationDetailsSchema = z.infer<ReturnType<typeof getOrganisationDetailsSchema>>;
