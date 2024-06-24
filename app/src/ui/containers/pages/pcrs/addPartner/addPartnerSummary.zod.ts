import { ZodRawShape, z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PCROrganisationType, PCRProjectLocation, PCRProjectRole } from "@framework/constants/pcrConstants";

export const addPartnerErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner"] });

const submitAddPartnerSummarySchema = <
  RegNumberAndAddress extends ZodRawShape,
  IndustrialSize extends ZodRawShape,
  ProjectManager extends ZodRawShape,
  TsbReference extends ZodRawShape,
>(
  regNumberAndAddress: RegNumberAndAddress,
  industrialSize: IndustrialSize,
  projectManager: ProjectManager,
  tsbReference: TsbReference,
) =>
  z.object({
    organisationName: z.string(),
    ...regNumberAndAddress,
    participantSize: z.number().gt(0),
    ...industrialSize,
    projectLocation: z
      .number()
      .gt(0)
      .transform(x => x as PCRProjectLocation),
    projectCity: z.string().min(1),
    projectPostcode: z.string().max(10).optional().nullable(),
    contact1Forename: z.string().min(1),
    contact1Surname: z.string().min(1),
    contact1Phone: z.string().min(1),
    contact1Email: z.string().min(1),
    ...projectManager,
    awardRate: z.number(),
    button_submit: z.string(),
    isCommercialWork: z.boolean(),
    hasOtherFunding: z.boolean(),
    organisationType: z.string(),
    partnerType: z.number().gt(0),
    projectRole: z.number().gt(0),
    ...tsbReference,
    markedAsComplete: z.literal(true),
  });

const saveAddPartnerSummarySchema = z.object({
  organisationName: z.string().nullable().optional(),
  registrationNumber: z.string().nullable().optional(),
  registeredAddress: z.string().nullable().optional(),
  participantSize: z.number().nullable().optional(),
  numberOfEmployees: z.number().nullable().optional(),
  financialYearEndDate: z.date().nullable().optional(),
  financialYearEndTurnover: z.number().nullable().optional(),
  projectCity: z.string().nullable().optional(),
  projectLocation: z
    .number()
    .transform(x => x as PCRProjectLocation)
    .nullable()
    .optional(),
  projectPostcode: z.string().max(10).nullable().optional(),
  contact1Forename: z.string().nullable().optional(),
  contact1Surname: z.string().nullable().optional(),
  contact1Phone: z.string().nullable().optional(),
  contact1Email: z.string().nullable().optional(),
  contact2Forename: z.string().nullable().optional(),
  contact2Surname: z.string().nullable().optional(),
  contact2Phone: z.string().nullable().optional(),
  contact2Email: z.string().nullable().optional(),
  awardRate: z.number().nullable().optional(),

  button_submit: z.string(),
  partnerType: z.number().gt(0),
  projectRole: z.number().gt(0),
  isCommercialWork: z.boolean(),
  hasOtherFunding: z.boolean().nullable().optional(),
  organisationType: z.string().min(1),
  tsbReference: z.string().nullable().optional(),
  markedAsComplete: z.literal(false),
});

export const getAddPartnerSummarySchema = ({
  projectRole,
  organisationType,
}: {
  projectRole: PCRProjectRole;
  organisationType: PCROrganisationType;
}) => {
  const markedAsCompleteSchema = submitAddPartnerSummarySchema(
    organisationType === PCROrganisationType.Industrial
      ? { registrationNumber: z.string(), registeredAddress: z.string() }
      : {},
    organisationType === PCROrganisationType.Industrial
      ? { numberOfEmployees: z.number(), financialYearEndDate: z.date(), financialYearEndTurnover: z.number().min(0) }
      : {},
    projectRole === PCRProjectRole.ProjectLead
      ? {
          contact2Email: z.string().min(1),
          contact2Forename: z.string().min(1),
          contact2Phone: z.string().min(1),
          contact2Surname: z.string().min(1),
        }
      : {},
    organisationType === PCROrganisationType.Academic ? { tsbReference: z.string().min(1) } : {},
  );

  return z.discriminatedUnion("markedAsComplete", [saveAddPartnerSummarySchema, markedAsCompleteSchema]);
};

export type AddPartnerSchema = Omit<z.output<ReturnType<typeof getAddPartnerSummarySchema>>, "markedAsComplete"> & {
  markedAsComplete: boolean;
};
