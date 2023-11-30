import { SpendProfileStep } from "@ui/containers/pages/pcrs/addPartner/spendProfileStep";
import { AwardRateStep } from "@ui/containers/pages/pcrs/addPartner/awardRateStep";
import { OtherFundingStep } from "@ui/containers/pages/pcrs/addPartner/otherFundingStep";
import { NonAidFundingStep } from "@ui/containers/pages/pcrs/addPartner/steps/nonAidFundingStep";
import { DeMinimisStep } from "@ui/containers/pages/pcrs/addPartner/deMinimisStep";
import { OtherSourcesOfFundingStep } from "@ui/containers/pages/pcrs/addPartner/otherSourcesOfFundingStep";
import { AcademicCostsReviewStep } from "@ui/containers/pages/pcrs/addPartner/academicCostsReviewStep";
import { AgreementToPCRStep } from "./agreementToPcrStep";
import { PCRStepType, PCROrganisationType, PCRItemType, PCRProjectRole } from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { CombinedResultValidator } from "@ui/validation/results";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { IPCRWorkflow } from "../pcrWorkflow";
import { AcademicCostsStep } from "./academicCostsStep";
import { AcademicOrganisationStep } from "./steps/academicOrganisationStep";
import { AddPartnerSummary } from "./addPartnerSummary";
import { StateAidEligibilityStep } from "./steps/aidEligibilityStep";
import { CompaniesHouseStep } from "./CompaniesHouse/CompaniesHouseStep";
import { FinanceContactStep } from "./steps/financeContactStep";
import { FinanceDetailsStep } from "./financeDetailsStep";
import { JeSStep } from "./steps/jeSStep";
import { OrganisationDetailsStep } from "./steps/organisationDetailsSteps";
import { ProjectLocationStep } from "./steps/projectLocationStep";
import { ProjectManagerDetailsStep } from "./steps/projectManagerDetailsStep";
import { RoleAndOrganisationStep } from "./steps/roleAndOrganisationStep";

export type AddPartnerStepNames =
  | PCRStepType.roleAndOrganisationStep
  | PCRStepType.aidEligibilityStep
  | PCRStepType.academicCostsStep
  | PCRStepType.academicOrganisationStep
  | PCRStepType.companiesHouseStep
  | PCRStepType.organisationDetailsStep
  | PCRStepType.financeDetailsStep
  | PCRStepType.projectLocationStep
  | PCRStepType.financeContactStep
  | PCRStepType.projectManagerDetailsStep
  | PCRStepType.spendProfileStep
  | PCRStepType.jeSStep
  | PCRStepType.awardRateStep
  | PCRStepType.otherFundingStep
  | PCRStepType.otherFundingSourcesStep
  | PCRStepType.agreementToPcrStep;

export type AddPartnerWorkflowItem = Pick<
  PCRItemForPartnerAdditionDto,
  "projectRole" | "partnerType" | "isCommercialWork" | "typeOfAid" | "organisationType" | "hasOtherFunding"
>;

export const getAddPartnerWorkflow = (
  item: AddPartnerWorkflowItem,
  step: number | undefined,
): IPCRWorkflow<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> => {
  const workflow: IPCRWorkflow<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> = {
    steps: [
      {
        stepName: PCRStepType.projectLocationStep,
        displayName: "Project location",
        stepNumber: 6,
        validation: val => val.pcr,
        migratedStepRender: ProjectLocationStep,
      },
      {
        stepName: PCRStepType.financeContactStep,
        displayName: "Finance contact",
        stepNumber: 7,
        validation: val => val.pcr,
        migratedStepRender: FinanceContactStep,
      },
      {
        stepName: PCRStepType.otherFundingStep,
        displayName: "Other public sector funding",
        stepNumber: 11,
        validation: val => val.pcr,
        stepRender: OtherFundingStep,
      },
      {
        stepName: PCRStepType.awardRateStep,
        displayName: "Funding level",
        stepNumber: 13,
        validation: val => val.pcr,
        stepRender: AwardRateStep,
      },
      {
        stepName: PCRStepType.agreementToPcrStep,
        displayName: "Upload partner agreement",
        stepNumber: 14,
        validation: val => val.files,
        stepRender: AgreementToPCRStep,
      },
    ],
    summary: {
      validation: val => val,
      summaryRender: AddPartnerSummary,
    },
    isMigratedToGql: true,
  };

  if (step === 1 || !item.projectRole || !item.partnerType) {
    workflow.steps.push({
      stepName: PCRStepType.roleAndOrganisationStep,
      displayName: "New partner information",
      stepNumber: 1,
      migratedStepRender: RoleAndOrganisationStep,
    });
  }

  if (!item.isCommercialWork) {
    workflow.steps.push({
      stepName: PCRStepType.aidEligibilityStep,
      displayName: "Non aid eligibility",
      stepNumber: 2,
      validation: val => val.pcr,
      migratedStepRender: NonAidFundingStep,
    });
  } else if (item.typeOfAid === TypeOfAid.DeMinimisAid) {
    workflow.steps.push({
      stepName: PCRStepType.aidEligibilityStep,
      displayName: "De minimis funding",
      stepNumber: 2,
      validation: val => val,
      stepRender: DeMinimisStep,
    });
  } else {
    workflow.steps.push({
      stepName: PCRStepType.aidEligibilityStep,
      displayName: "State aid funding",
      stepNumber: 2,
      validation: val => val.pcr,
      migratedStepRender: StateAidEligibilityStep,
    });
  }

  if (item.organisationType === PCROrganisationType.Academic) {
    workflow.steps.push({
      stepName: PCRStepType.academicOrganisationStep,
      displayName: "Organisation name",
      stepNumber: 3,
      validation: val => val.pcr,
      migratedStepRender: AcademicOrganisationStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.jeSStep,
      displayName: "Je-S form",
      stepNumber: 9,
      validation: val => val.files,
      migratedStepRender: JeSStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.academicCostsStep,
      displayName: "Academic costs",
      stepNumber: 10,
      validation: val => {
        const addPartnerValidator = val.pcr.items.results.find(
          x => x.model.type === PCRItemType.PartnerAddition,
        ) as PCRPartnerAdditionItemDtoValidator;

        return new CombinedResultValidator(
          addPartnerValidator.tsbReference,
          ...addPartnerValidator.spendProfile.results[0].errors,
        );
      },
      stepRender: AcademicCostsStep,
      readonlyStepRender: AcademicCostsReviewStep,
    });
  } else {
    workflow.steps.push({
      stepName: PCRStepType.companiesHouseStep,
      displayName: "Companies house",
      stepNumber: 3,
      validation: val => val.pcr,
      migratedStepRender: CompaniesHouseStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.organisationDetailsStep,
      displayName: "Organisation details",
      stepNumber: 4,
      validation: val => val.pcr,
      stepRender: OrganisationDetailsStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.financeDetailsStep,
      displayName: "Financial details",
      stepNumber: 5,
      validation: val => val.pcr,
      stepRender: FinanceDetailsStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.spendProfileStep,
      displayName: "Project costs for new partner",
      stepNumber: 9,
      validation: val => val.pcr,
      stepRender: SpendProfileStep,
      readonlyStepRender: SpendProfileStep,
    });
  }

  if (item.projectRole === PCRProjectRole.ProjectLead) {
    workflow.steps.push({
      stepName: PCRStepType.projectManagerDetailsStep,
      displayName: "Project manager",
      stepNumber: 8,
      validation: val => val.pcr,
      migratedStepRender: ProjectManagerDetailsStep,
    });
  }

  if (item.hasOtherFunding) {
    workflow.steps.push({
      stepName: PCRStepType.otherFundingSourcesStep,
      displayName: "Other public sector funding",
      stepNumber: 12,
      validation: val => {
        const addPartnerValidator = val.pcr.items.results.find(
          x => x.model.type === PCRItemType.PartnerAddition,
        ) as PCRPartnerAdditionItemDtoValidator;
        return addPartnerValidator.spendProfile.results[0];
      },
      stepRender: OtherSourcesOfFundingStep,
    });
  }

  return workflow;
};
