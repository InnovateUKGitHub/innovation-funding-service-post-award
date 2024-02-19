import { positiveIntegerInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

const employeesLessThan = 100_000_000;

export const getOrganisationDetailsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        participantSize: z.coerce.number().gt(0),
        numberOfEmployees: positiveIntegerInput({ lt: employeesLessThan }),
      })
    : z.object({
        button_submit: z.string(),
        participantSize: z.coerce.number(),
        numberOfEmployees: positiveIntegerInput({ lt: employeesLessThan }).nullable(),
      });

export type OrganisationDetailsSchema = z.infer<ReturnType<typeof getOrganisationDetailsSchema>>;
