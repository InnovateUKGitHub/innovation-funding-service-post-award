import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PCROrganisationType, PCRProjectLocation, PCRProjectRole } from "@framework/constants/pcrConstants";

export const addPartnerErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner"] });

// const common = {
//   button_submit: z.string(),
//   markedAsComplete: z.boolean(),
// };

// export const spendProfileSchema = z.object({
//   ...common,
// });

// export type SpendProfileSchema = z.infer<typeof spendProfileSchema>;

const projectManagerDetailsSchema = z.object({
  contact2Email: z.string().min(1),
  contact2Forename: z.string().min(1),
  contact2Phone: z.string().min(1),
  contact2Surname: z.string().min(1),
});

const submitAddPartnerSummarySchema = z.object({
  button_submit: z.string(),
  awardRate: z.number(),
  isCommercialWork: z.boolean(),
  contact1Email: z.string().min(1),
  contact1Forename: z.string().min(1),
  contact1Phone: z.string().min(1),
  contact1Surname: z.string().min(1),
  hasOtherFunding: z.boolean(),
  organisationName: z.string(),
  organisationType: z.string(),
  participantSize: z.number(),
  partnerType: z.number().gt(0),
  projectCity: z.string().min(1),
  projectLocation: z
    .number()
    .gt(0)
    .transform(x => x as PCRProjectLocation),
  projectPostcode: z.string().max(10).optional().nullable(),
  projectRole: z.number().gt(0),
});

const saveAddPartnerSummarySchema = z.object({
  button_submit: z.string(),
  partnerType: z.number().gt(0),
  projectRole: z.number().gt(0),
  isCommercialWork: z.boolean(),
  awardRate: z.number().nullable().optional(),
  contact1Email: z.string().nullable().optional(),
  contact1Forename: z.string().nullable().optional(),
  contact1Phone: z.string().nullable().optional(),
  contact1Surname: z.string().nullable().optional(),
  contact2Email: z.string().nullable().optional(),
  contact2Forename: z.string().nullable().optional(),
  contact2Phone: z.string().nullable().optional(),
  contact2Surname: z.string().nullable().optional(),
  financialYearEndDate: z.date().nullable().optional(),
  financialYearEndTurnover: z.number().nullable().optional(),
  hasOtherFunding: z.boolean().nullable().optional(),
  numberOfEmployees: z.number().nullable().optional(),
  organisationName: z.string().nullable().optional(),
  organisationType: z.string().min(1),
  participantSize: z.number().nullable().optional(),
  projectCity: z.string().nullable().optional(),
  projectLocation: z
    .number()
    .transform(x => x as PCRProjectLocation)
    .nullable()
    .optional(),
  projectPostcode: z.string().max(10).nullable().optional(),
  registeredAddress: z.string().nullable().optional(),
  registrationNumber: z.string().nullable().optional(),
  tsbReference: z.string().nullable().optional(),
});

const academicPartnerSummarySchema = z.object({
  tsbReference: z.string().min(1),
});

const industrialPartnerSummarySchema = z.object({
  registeredAddress: z.string(),
  registrationNumber: z.string(),
  numberOfEmployees: z.number(),
  financialYearEndDate: z.date(),
  financialYearEndTurnover: z.number().min(0).nullable(),
});

export const getAddPartnerSummarySchema = ({
  projectRole,
  organisationType,
}: {
  projectRole: PCRProjectRole;
  organisationType: PCROrganisationType;
}) => {
  let markedAsCompleteSchema = submitAddPartnerSummarySchema;

  if (projectRole === PCRProjectRole.ProjectLead) {
    markedAsCompleteSchema = markedAsCompleteSchema.merge(projectManagerDetailsSchema);
  }

  if (organisationType === PCROrganisationType.Academic) {
    markedAsCompleteSchema = markedAsCompleteSchema.merge(academicPartnerSummarySchema);
  }

  if (organisationType === PCROrganisationType.Industrial) {
    markedAsCompleteSchema = markedAsCompleteSchema.merge(industrialPartnerSummarySchema);
  }

  return z.discriminatedUnion("markedAsComplete", [
    z
      .object({
        markedAsComplete: z.literal(false),
      })
      .merge(saveAddPartnerSummarySchema),
    z
      .object({
        markedAsComplete: z.literal(true),
      })
      .merge(markedAsCompleteSchema),
  ]);
};

export type AddPartnerSchema = z.infer<ReturnType<typeof getAddPartnerSummarySchema>>;
