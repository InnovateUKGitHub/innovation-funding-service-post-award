import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { isEmptyDate, isValidMonth, isValidYear } from "@framework/validation-helpers/date";
import { PCROrganisationType, PCRProjectLocation, PCRProjectRole } from "@framework/constants/pcrConstants";

export const addPartnerErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner"] });

const common = {
  button_submit: z.string(),
  markedAsComplete: z.boolean(),
};

export const roleAndOrganisationSchema = z.object({
  ...common,
  projectRole: z.coerce.number().gt(0),
  isCommercialWork: z.string(),
  partnerType: z.coerce.number().gt(0),
});

export type RoleAndOrganisationSchema = z.infer<typeof roleAndOrganisationSchema>;

export const academicOrganisationSchema = z.object({
  ...common,
  organisationName: z.string(),
});

export type AcademicOrganisationSchema = z.infer<typeof academicOrganisationSchema>;

export const academicCostsSchema = z.object({
  ...common,
  tsbReference: z.string(),
  costs: z.array(
    z.object({
      value: z.coerce.number(),
    }),
  ),
});

export type AcademicCostsSchema = z.infer<typeof academicCostsSchema>;

export const getProjectLocationSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        projectLocation: z.coerce.number().gt(0),
        projectCity: z.string().min(1).max(40),
        projectPostcode: z.string().max(10),
      })
    : z.object({
        button_submit: z.string(),
        projectLocation: z.coerce.number().gt(0),
        projectCity: z.string().max(40),
        projectPostcode: z.string().max(10),
      });

export type ProjectLocationSchema = z.infer<ReturnType<typeof getProjectLocationSchema>>;

export const financeContactSchema = z.object({
  ...common,
  contact1Email: z.string().max(255),
  contact1Forename: z.string().max(50),
  contact1Surname: z.string().max(50),
  contact1Phone: z.string().max(20),
});

export type FinanceContactSchema = z.infer<typeof financeContactSchema>;

export const projectManagerSchema = z.object({
  ...common,
  contact2Email: z.string().max(255),
  contact2Forename: z.string().max(50),
  contact2Surname: z.string().max(50),
  contact2Phone: z.string().max(20),
});

export type ProjectManagerSchema = z.infer<typeof projectManagerSchema>;

export const companiesHouseSchema = z.object({
  ...common,
  organisationName: z.string(),
  registrationNumber: z.string(),
  registeredAddress: z.string(),
  searchResults: z.string(),
});

export type CompaniesHouseSchema = z.infer<typeof companiesHouseSchema>;

export const organisationDetailsSchema = z.object({
  ...common,
  participantSize: z.coerce.number(),
  numberOfEmployees: z.coerce.number().nullable(),
});

export type OrganisationDetailsSchema = z.infer<typeof organisationDetailsSchema>;

export const awardRateSchema = z.object({
  ...common,
  awardRate: z.coerce.number().nullable(),
});

export type AwardRateSchema = z.infer<typeof awardRateSchema>;

export const otherFundingSchema = z.object({
  ...common,
  hasOtherFunding: z.string().nullable(),
});

export type OtherFundingSchema = z.infer<typeof otherFundingSchema>;

const valueDescription = z.object({
  value: z.coerce.number().min(1),
  description: z.string().min(1),
});

/*
 * this approach bypasses the limitation that objects only reach refine after all fields have been otherwise passed
 */
const dateSecured = z
  .object({
    dateSecured_month: z.string().optional().nullable(),
    dateSecured_year: z.string().optional().nullable(),
    dateSecured: z.date().nullable(),
  })
  .superRefine((data, ctx) => {
    if (isEmptyDate(data.dateSecured_month, data.dateSecured_year)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dateSecured"],
      });
    }

    if (!isValidMonth(data.dateSecured_month) || !isValidYear(data.dateSecured_year)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        path: ["dateSecured"],
      });
    }
  });

export const fundingSchema = z.object({
  funds: z.array(valueDescription.and(dateSecured)),
});

const baseSchema = z.object({
  ...common,
  itemsLength: z.string(),
});

export const otherSourcesOfFundingSchema = baseSchema.and(fundingSchema);

export type OtherSourcesOfFundingSchema = z.infer<typeof otherSourcesOfFundingSchema>;

export const spendProfileSchema = z.object({
  ...common,
});

export type SpendProfileSchema = z.infer<typeof spendProfileSchema>;

export const financeDetailsSchema = z
  .object({
    ...common,
    financialYearEndTurnover: z.coerce.number().nullable(),
    financialYearEndDate_month: z.string().optional(),
    financialYearEndDate_year: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!isEmptyDate(data.financialYearEndDate_month, data.financialYearEndDate_year)) {
      if (!isValidMonth(data.financialYearEndDate_month) || !isValidYear(data.financialYearEndDate_year)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["financialYearEndDate"],
        });
      }
    }
  });

export type FinanceDetailsSchema = z.infer<typeof financeDetailsSchema>;

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
  projectLocation: z.number().transform(x => x as PCRProjectLocation),
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
  financialYearEndTurnover: z.number(),
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
