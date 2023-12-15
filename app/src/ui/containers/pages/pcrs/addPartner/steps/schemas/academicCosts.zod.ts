import { z } from "zod";

export const getAcademicCostsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        tsbReference: z.string().min(1),
        costs: z.array(
          z.object({
            value: z.coerce.number(),
            costCategoryId: z.string(),
          }),
        ),
      })
    : z.object({
        button_submit: z.string(),
        tsbReference: z.string(),
        costs: z.array(
          z.object({
            value: z.coerce.number(),
            costCategoryId: z.string(),
          }),
        ),
      });

export type AcademicCostsSchema = z.infer<ReturnType<typeof getAcademicCostsSchema>>;
