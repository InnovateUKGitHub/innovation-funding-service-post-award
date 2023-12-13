import { z } from "zod";

export const getProjectManagerSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        contact2Email: z.string().max(255).min(1),
        contact2Forename: z.string().max(50).min(1),
        contact2Surname: z.string().max(50).min(1),
        contact2Phone: z.string().max(20).min(1),
      })
    : z.object({
        button_submit: z.string(),
        contact2Email: z.string().max(255),
        contact2Forename: z.string().max(50),
        contact2Surname: z.string().max(50),
        contact2Phone: z.string().max(20),
      });

export type ProjectManagerSchema = z.infer<ReturnType<typeof getProjectManagerSchema>>;
