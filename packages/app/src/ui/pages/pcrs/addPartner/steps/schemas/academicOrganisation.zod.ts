import { FormTypes } from "@ui/zod/FormTypes";
import { accountIdValidation } from "@ui/zod/helperValidators/helperValidators.zod";
import { z } from "zod";

export const getAcademicOrganisationSchema = (markedAsComplete: boolean) => {
  const accountValidation = z.union([accountIdValidation, z.literal("search")]);

  return z.object({
    form: z.literal(FormTypes.PcrAddPartnerAcademicOrganisationStep),
    accountId: markedAsComplete ? accountValidation : accountValidation.optional(),
    button_submit: z.union([z.literal("submit"), z.literal("returnToSummary")]),
  });
};

export const academicOrganisationSearchSchema = z.object({
  search: z.string().min(1),
});

export type AcademicOrganisationSchemaType = ReturnType<typeof getAcademicOrganisationSchema>;
export type AcademicOrganisationSchema = z.infer<AcademicOrganisationSchemaType>;

export type AcademicOrganisationSearchSchemaType = typeof academicOrganisationSearchSchema;
