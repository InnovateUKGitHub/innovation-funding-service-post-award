import { SpendProfileStep } from "@ui/containers/pages/pcrs/addPartner/steps/spendProfileStep";
import { AwardRateStep } from "@ui/containers/pages/pcrs/addPartner/steps/awardRateStep";
import { OtherFundingStep } from "@ui/containers/pages/pcrs/addPartner/steps/otherFundingStep";
import { NonAidFundingStep } from "@ui/containers/pages/pcrs/addPartner/steps/nonAidFundingStep";
import { DeMinimisStep } from "@ui/containers/pages/pcrs/addPartner/steps/deMinimisStep";
import { OtherSourcesOfFundingStep } from "@ui/containers/pages/pcrs/addPartner/steps/otherSourcesOfFundingStep";
import { AcademicCostsReviewStep } from "@ui/containers/pages/pcrs/addPartner/steps/academicCostsReviewStep";
import { AgreementToPCRStep } from "./steps/agreementToPcrStep";
import { PCRStepType, PCROrganisationType, PCRProjectRole } from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { IPCRWorkflow } from "../pcrWorkflow";
import { AcademicCostsStep } from "./steps/academicCostsStep";
import { AcademicOrganisationStep } from "./steps/academicOrganisationStep";
import { AddPartnerSummary } from "./addPartnerSummary";
import { StateAidEligibilityStep } from "./steps/aidEligibilityStep";
import { CompaniesHouseStep } from "./steps/CompaniesHouse/CompaniesHouseStep";
import { FinanceContactStep } from "./steps/financeContactStep";
import { FinanceDetailsStep } from "./steps/financeDetailsStep";
import { JeSStep } from "./steps/jeSStep";
import { OrganisationDetailsStep } from "./steps/organisationDetailsStep";
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
  "projectRole" | "partnerType" | "isCommercialWork" | "typeOfAid" | "organisationType" | "hasOtherFunding" | "type"
>;

export const getAddPartnerWorkflow = (item: AddPartnerWorkflowItem, step: number | undefined): IPCRWorkflow => {
  const workflow: IPCRWorkflow = {
    steps: [
      {
        stepName: PCRStepType.projectLocationStep,
        displayName: "Project location",
        stepNumber: 6,
        stepRender: ProjectLocationStep,
      },
      {
        stepName: PCRStepType.financeContactStep,
        displayName: "Finance contact",
        stepNumber: 7,
        stepRender: FinanceContactStep,
      },
      {
        stepName: PCRStepType.otherFundingStep,
        displayName: "Other public sector funding",
        stepNumber: 11,
        stepRender: OtherFundingStep,
      },
      {
        stepName: PCRStepType.awardRateStep,
        displayName: "Funding level",
        stepNumber: 13,
        stepRender: AwardRateStep,
      },
      {
        stepName: PCRStepType.agreementToPcrStep,
        displayName: "Upload partner agreement",
        stepNumber: 14,
        stepRender: AgreementToPCRStep,
      },
    ],
    summary: {
      summaryRender: AddPartnerSummary,
    },
  };

  if (step === 1 || !item.projectRole || !item.partnerType) {
    workflow.steps.push({
      stepName: PCRStepType.roleAndOrganisationStep,
      displayName: "New partner information",
      stepNumber: 1,
      stepRender: RoleAndOrganisationStep,
    });
  }

  if (!item.isCommercialWork) {
    workflow.steps.push({
      stepName: PCRStepType.aidEligibilityStep,
      displayName: "Non aid eligibility",
      stepNumber: 2,
      stepRender: NonAidFundingStep,
    });
  } else if (item.typeOfAid === TypeOfAid.DeMinimisAid) {
    workflow.steps.push({
      stepName: PCRStepType.aidEligibilityStep,
      displayName: "De minimis funding",
      stepNumber: 2,
      stepRender: DeMinimisStep,
    });
  } else {
    workflow.steps.push({
      stepName: PCRStepType.aidEligibilityStep,
      displayName: "State aid funding",
      stepNumber: 2,
      stepRender: StateAidEligibilityStep,
    });
  }

  if (item.organisationType === PCROrganisationType.Academic) {
    workflow.steps.push({
      stepName: PCRStepType.academicOrganisationStep,
      displayName: "Organisation name",
      stepNumber: 3,
      stepRender: AcademicOrganisationStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.jeSStep,
      displayName: "Je-S form",
      stepNumber: 9,
      stepRender: JeSStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.academicCostsStep,
      displayName: "Academic costs",
      stepNumber: 10,
      stepRender: AcademicCostsStep,
      readonlyStepRender: AcademicCostsReviewStep,
    });
  } else {
    workflow.steps.push({
      stepName: PCRStepType.companiesHouseStep,
      displayName: "Companies house",
      stepNumber: 3,
      stepRender: CompaniesHouseStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.organisationDetailsStep,
      displayName: "Organisation details",
      stepNumber: 4,
      stepRender: OrganisationDetailsStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.financeDetailsStep,
      displayName: "Financial details",
      stepNumber: 5,
      stepRender: FinanceDetailsStep,
    });
    workflow.steps.push({
      stepName: PCRStepType.spendProfileStep,
      displayName: "Project costs for new partner",
      stepNumber: 9,
      stepRender: SpendProfileStep,
      readonlyStepRender: SpendProfileStep,
    });
  }

  if (item.projectRole === PCRProjectRole.ProjectLead) {
    workflow.steps.push({
      stepName: PCRStepType.projectManagerDetailsStep,
      displayName: "Project manager",
      stepNumber: 8,
      stepRender: ProjectManagerDetailsStep,
    });
  }

  if (item.hasOtherFunding) {
    workflow.steps.push({
      stepName: PCRStepType.otherFundingSourcesStep,
      displayName: "Other public sector funding",
      stepNumber: 12,
      stepRender: OtherSourcesOfFundingStep,
    });
  }

  return workflow;
};
