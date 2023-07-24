import { SpendProfileStep } from "@ui/containers/pages/pcrs/addPartner/spendProfileStep";
import { AwardRateStep } from "@ui/containers/pages/pcrs/addPartner/awardRateStep";
import { OtherFundingStep } from "@ui/containers/pages/pcrs/addPartner/otherFundingStep";
import { NonAidFundingStep } from "@ui/containers/pages/pcrs/addPartner/nonAidFundingStep";
import { DeMinimisStep } from "@ui/containers/pages/pcrs/addPartner/deMinimisStep";
import { OtherSourcesOfFundingStep } from "@ui/containers/pages/pcrs/addPartner/otherSourcesOfFundingStep";
import { AcademicCostsReviewStep } from "@ui/containers/pages/pcrs/addPartner/academicCostsReviewStep";
import { AgreementToPCRStep } from "./agreementToPcrStep";
import { PCRStepId, PCROrganisationType, PCRItemType, PCRProjectRole } from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { CombinedResultValidator } from "@ui/validation/results";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { IPCRWorkflow } from "../pcrWorkflow";
import { AcademicCostsStep } from "./academicCostsStep";
import { AcademicOrganisationStep } from "./academicOrganisationStep";
import { AddPartnerSummary } from "./addPartnerSummary";
import { StateAidEligibilityStep } from "./aidEligibilityStep";
import { CompaniesHouseStep } from "./CompaniesHouse/CompaniesHouseStep";
import { FinanceContactStep } from "./financeContactStep";
import { FinanceDetailsStep } from "./financeDetailsStep";
import { JeSStep } from "./jeSStep";
import { OrganisationDetailsStep } from "./organisationDetailsSteps";
import { ProjectLocationStep } from "./projectLocationStep";
import { ProjectManagerDetailsStep } from "./projectManagerDetailsStep";
import { RoleAndOrganisationStep } from "./roleAndOrganisationStep";

export type AddPartnerStepNames =
  | PCRStepId.roleAndOrganisationStep
  | PCRStepId.aidEligibilityStep
  | PCRStepId.academicCostsStep
  | PCRStepId.academicOrganisationStep
  | PCRStepId.companiesHouseStep
  | PCRStepId.organisationDetailsStep
  | PCRStepId.financeDetailsStep
  | PCRStepId.projectLocationStep
  | PCRStepId.financeContactStep
  | PCRStepId.projectManagerDetailsStep
  | PCRStepId.spendProfileStep
  | PCRStepId.jeSStep
  | PCRStepId.awardRateStep
  | PCRStepId.otherFundingStep
  | PCRStepId.otherFundingSourcesStep
  | PCRStepId.agreementToPcrStep;

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
        stepName: PCRStepId.projectLocationStep,
        displayName: "Project location",
        stepNumber: 6,
        validation: val => val.pcr,
        stepRender: ProjectLocationStep,
      },
      {
        stepName: PCRStepId.financeContactStep,
        displayName: "Finance contact",
        stepNumber: 7,
        validation: val => val.pcr,
        stepRender: FinanceContactStep,
      },
      {
        stepName: PCRStepId.otherFundingStep,
        displayName: "Other public sector funding",
        stepNumber: 11,
        validation: val => val.pcr,
        stepRender: OtherFundingStep,
      },
      {
        stepName: PCRStepId.awardRateStep,
        displayName: "Funding level",
        stepNumber: 13,
        validation: val => val.pcr,
        stepRender: AwardRateStep,
      },
      {
        stepName: PCRStepId.agreementToPcrStep,
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
  };

  if (step === 1 || !item.projectRole || !item.partnerType) {
    workflow.steps.push({
      stepName: PCRStepId.roleAndOrganisationStep,
      displayName: "New partner information",
      stepNumber: 1,
      validation: val => val.pcr,
      stepRender: RoleAndOrganisationStep,
    });
  }

  if (!item.isCommercialWork) {
    workflow.steps.push({
      stepName: PCRStepId.aidEligibilityStep,
      displayName: "Non aid eligibility",
      stepNumber: 2,
      validation: val => val.pcr,
      stepRender: NonAidFundingStep,
    });
  } else if (item.typeOfAid === TypeOfAid.DeMinimisAid) {
    workflow.steps.push({
      stepName: PCRStepId.aidEligibilityStep,
      displayName: "De minimis funding",
      stepNumber: 2,
      validation: val => val,
      stepRender: DeMinimisStep,
    });
  } else {
    workflow.steps.push({
      stepName: PCRStepId.aidEligibilityStep,
      displayName: "State aid funding",
      stepNumber: 2,
      validation: val => val.pcr,
      stepRender: StateAidEligibilityStep,
    });
  }

  if (item.organisationType === PCROrganisationType.Academic) {
    workflow.steps.push({
      stepName: PCRStepId.academicOrganisationStep,
      displayName: "Organisation name",
      stepNumber: 3,
      validation: val => val.pcr,
      stepRender: AcademicOrganisationStep,
    });
    workflow.steps.push({
      stepName: PCRStepId.jeSStep,
      displayName: "Je-S form",
      stepNumber: 9,
      validation: val => val.files,
      stepRender: JeSStep,
    });
    workflow.steps.push({
      stepName: PCRStepId.academicCostsStep,
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
      stepName: PCRStepId.companiesHouseStep,
      displayName: "Companies house",
      stepNumber: 3,
      validation: val => val.pcr,
      stepRender: CompaniesHouseStep,
    });
    workflow.steps.push({
      stepName: PCRStepId.organisationDetailsStep,
      displayName: "Organisation details",
      stepNumber: 4,
      validation: val => val.pcr,
      stepRender: OrganisationDetailsStep,
    });
    workflow.steps.push({
      stepName: PCRStepId.financeDetailsStep,
      displayName: "Financial details",
      stepNumber: 5,
      validation: val => val.pcr,
      stepRender: FinanceDetailsStep,
    });
    workflow.steps.push({
      stepName: PCRStepId.spendProfileStep,
      displayName: "Project costs for new partner",
      stepNumber: 9,
      validation: val => val.pcr,
      stepRender: SpendProfileStep,
      readonlyStepRender: SpendProfileStep,
    });
  }

  if (item.projectRole === PCRProjectRole.ProjectLead) {
    workflow.steps.push({
      stepName: PCRStepId.projectManagerDetailsStep,
      displayName: "Project manager",
      stepNumber: 8,
      validation: val => val.pcr,
      stepRender: ProjectManagerDetailsStep,
    });
  }

  if (item.hasOtherFunding) {
    workflow.steps.push({
      stepName: PCRStepId.otherFundingSourcesStep,
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