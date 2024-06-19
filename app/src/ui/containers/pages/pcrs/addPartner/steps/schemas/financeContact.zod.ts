import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const getFinanceContactSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        form: z.literal(FormTypes.PcrAddPartnerFinanceContactStep),
        markedAsComplete: z.string(),
        button_submit: z.string(),
        contact1Email: z.string().max(255).min(1),
        contact1Forename: z.string().max(50).min(1),
        contact1Surname: z.string().max(50).min(1),
        contact1Phone: z.string().max(20).min(1),
      })
    : z.object({
        form: z.literal(FormTypes.PcrAddPartnerFinanceContactStep),
        markedAsComplete: z.string(),
        button_submit: z.string(),
        contact1Email: z.string().max(255),
        contact1Forename: z.string().max(50),
        contact1Surname: z.string().max(50),
        contact1Phone: z.string().max(20),
      });

export type FinanceContactSchemaType = ReturnType<typeof getFinanceContactSchema>;
export type FinanceContactSchema = z.infer<FinanceContactSchemaType>;
