import { z } from "zod";

export const getFinanceContactSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        contact1Email: z.string().max(255).min(1),
        contact1Forename: z.string().max(50).min(1),
        contact1Surname: z.string().max(50).min(1),
        contact1Phone: z.string().max(20).min(1),
      })
    : z.object({
        button_submit: z.string(),
        contact1Email: z.string().max(255),
        contact1Forename: z.string().max(50),
        contact1Surname: z.string().max(50),
        contact1Phone: z.string().max(20),
      });

export type FinanceContactSchema = z.infer<ReturnType<typeof getFinanceContactSchema>>;
