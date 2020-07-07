import React from "react";
import { PCRItemForPartnerAdditionDto, TypeOfAid } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemType, PCROrganisationType, PCRProjectRole } from "@framework/constants";
import {
  AcademicCostsStep,
  AcademicOrganisationStep,
  AddPartnerSummary,
  CompaniesHouseStep,
  FinanceContactStep,
  FinanceDetailsStep,
  JeSStep,
  OrganisationDetailsStep,
  ProjectLocationStep,
  ProjectManagerDetailsStep,
  RoleAndOrganisationStep,
  StateAidEligibilityStep
} from "@ui/containers/pcrs/addPartner";
import { SpendProfileStep } from "@ui/containers/pcrs/addPartner/spendProfileStep";
import { AwardRateStep } from "@ui/containers/pcrs/addPartner/awardRateStep";
import { OtherFundingStep } from "@ui/containers/pcrs/addPartner/otherFundingStep";
import { NonAidFundingStep } from "@ui/containers/pcrs/addPartner/nonAidFundingStep";
import { DeMinimisStep } from "@ui/containers/pcrs/addPartner/deMinimisStep";
import { CombinedResultValidator } from "@ui/validation";
import { OtherSourcesOfFundingStep } from "@ui/containers/pcrs/addPartner/otherSourcesOfFundingStep";

export type addPartnerStepNames =
  "roleAndOrganisationStep"
  | "aidEligibilityStep"
  | "academicCostsStep"
  | "academicOrganisationStep"
  | "companiesHouseStep"
  | "organisationDetailsStep"
  | "financeDetailsStep"
  | "projectLocationStep"
  | "financeContactStep"
  | "projectManagerDetailsStep"
  | "spendProfileStep"
  | "jeSStep"
  | "awardRateStep"
  | "otherFundingStep"
  | "otherFundingSourcesStep"
;

export const getAddPartnerWorkflow = (item: PCRItemForPartnerAdditionDto, step: number | undefined): IPCRWorkflow<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> => {
  const workflow: IPCRWorkflow<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> = {
    steps: [
      {
        stepName: "projectLocationStep",
        displayName: "Project location",
        stepNumber: 6,
        validation: val => val.pcr,
        stepRender: ProjectLocationStep,
      },
      {
        stepName: "financeContactStep",
        displayName: "Finance contact",
        stepNumber: 7,
        validation: val => val.pcr,
        stepRender: FinanceContactStep,
      },
      {
        stepName: "otherFundingStep",
        displayName: "Other public sector funding",
        stepNumber: 11,
        validation: val => val.pcr,
        stepRender: OtherFundingStep,
      },
      {
        stepName: "awardRateStep",
        displayName: "Funding level",
        stepNumber: 13,
        validation: val => val.pcr,
        stepRender: AwardRateStep,
      },
    ],
    summary: {
      validation: val => val,
      summaryRender: AddPartnerSummary,
    }
  };

  if (step === 1 || !item.projectRole || !item.partnerType) {
    workflow.steps.push({
      stepName: "roleAndOrganisationStep",
      displayName: "New partner information",
      stepNumber: 1,
      validation: val => val.pcr,
      stepRender: RoleAndOrganisationStep
    });
  }

  if (!item.isCommercialWork) {
    workflow.steps.push({
      stepName: "aidEligibilityStep",
      displayName: "Non aid eligibility",
      stepNumber: 2,
      validation: val => val.pcr,
      stepRender: NonAidFundingStep,
    });
  } else if (item.typeOfAid === TypeOfAid.DeMinimisAid) {
    workflow.steps.push({
      stepName: "aidEligibilityStep",
      displayName: "De minimis funding",
      stepNumber: 2,
      validation: val => val,
      stepRender: DeMinimisStep,
    });
  } else {
    workflow.steps.push({
      stepName: "aidEligibilityStep",
      displayName: "State aid funding",
      stepNumber: 2,
      validation: val => val.pcr,
      stepRender: StateAidEligibilityStep,
    });
  }

  if (item.organisationType === PCROrganisationType.Academic) {
    workflow.steps.push({
      stepName: "academicOrganisationStep",
      displayName: "Organisation name",
      stepNumber: 3,
      validation: val => val.pcr,
      stepRender: AcademicOrganisationStep
    });
    workflow.steps.push({
      stepName: "jeSStep",
      displayName: "Je-S form",
      stepNumber: 9,
      validation: val => val.files,
      stepRender: JeSStep
    });
    workflow.steps.push({
      stepName: "academicCostsStep",
      displayName: "Academic costs",
      stepNumber: 10,
      validation: val => {
        const addPartnerValidator = val.pcr.items.results.find(x =>
          x.model.type === PCRItemType.PartnerAddition) as PCRPartnerAdditionItemDtoValidator;

        return new CombinedResultValidator(
          addPartnerValidator.tsbReference,
          ...addPartnerValidator.spendProfile.results[0].errors
        );
      },
      stepRender: AcademicCostsStep
    });
  } else {
    workflow.steps.push({
      stepName: "companiesHouseStep",
      displayName: "Companies house",
      stepNumber: 3,
      validation: val => val.pcr,
      stepRender: CompaniesHouseStep
    });
    workflow.steps.push({
      stepName: "organisationDetailsStep",
      displayName: "Organisation details",
      stepNumber: 4,
      validation: val => val.pcr,
      stepRender: OrganisationDetailsStep,
    });
    workflow.steps.push({
      stepName: "financeDetailsStep",
      displayName: "Financial details",
      stepNumber: 5,
      validation: val => val.pcr,
      stepRender: FinanceDetailsStep,
    });
    workflow.steps.push({
      stepName: "spendProfileStep",
      displayName: "Project costs for new partner",
      stepNumber: 9,
      validation: val => val.pcr,
      stepRender: SpendProfileStep,
    });
  }

  if (item.projectRole === PCRProjectRole.ProjectLead) {
    workflow.steps.push({
      stepName: "projectManagerDetailsStep",
      displayName: "Project manager",
      stepNumber: 8,
      validation: val => val.pcr,
      stepRender: ProjectManagerDetailsStep
    });
  }

  if (item.hasOtherFunding) {
    workflow.steps.push({
      stepName: "otherFundingSourcesStep",
      displayName: "Other public sector funding",
      stepNumber: 12,
      validation: val => {
        const addPartnerValidator = val.pcr.items.results.find(x =>
          x.model.type === PCRItemType.PartnerAddition) as PCRPartnerAdditionItemDtoValidator;
        return addPartnerValidator.spendProfile.results[0];
      },
      stepRender: OtherSourcesOfFundingStep,
    });
  }

  return workflow;
};
