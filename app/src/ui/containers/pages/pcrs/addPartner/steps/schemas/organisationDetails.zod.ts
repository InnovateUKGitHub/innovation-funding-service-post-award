import { integerInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const getOrganisationDetailsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        participantSize: z.coerce.number().gt(0),
        numberOfEmployees: integerInput,
      })
    : z.object({
        button_submit: z.string(),
        participantSize: z.coerce.number(),
        numberOfEmployees: integerInput.nullable(),
      });

export type OrganisationDetailsSchema = z.infer<ReturnType<typeof getOrganisationDetailsSchema>>;
