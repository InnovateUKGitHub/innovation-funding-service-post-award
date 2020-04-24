import React from "react";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerType, PCRProjectRole } from "@framework/constants";
import {
  AcademicOrganisationStep,
  AddPartnerSummary,
  AidEligibilityStep,
  CompaniesHouseStep,
  FinanceContactStep,
  FinanceDetailsStep,
  OrganisationDetailsStep,
  ProjectLocationStep,
  ProjectManagerDetailsStep,
  RoleAndOrganisationStep
} from "@ui/containers/pcrs/addPartner";
import { SpendProfileStep } from "@ui/containers/pcrs/addPartner/spendProfileStep";

export type addPartnerStepNames =
  "roleAndOrganisationStep"
  | "aidEligibilityStep"
  | "academicOrganisationStep"
  | "companiesHouseStep"
  | "organisationDetailsStep"
  | "financeDetailsStep"
  | "projectLocationStep"
  | "financeContactStep"
  | "projectManagerDetailsStep"
  | "spendProfileStep"
  ;

export const getAddPartnerWorkflow = (item: PCRItemForPartnerAdditionDto, step: number | undefined): IPCRWorkflow<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> => {
  const workflow: IPCRWorkflow<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> = {
    steps: [
      {
        stepName: "aidEligibilityStep",
        displayName: "Aid eligibility",
        stepNumber: 2,
        validation: val => val.files,
        stepRender: AidEligibilityStep,
      },
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
        stepName: "spendProfileStep",
        displayName: "Project costs for new partner",
        stepNumber: 9,
        validation: val => val.pcr,
        stepRender: SpendProfileStep,
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

  if (item.partnerType === PCRPartnerType.Research) {
    workflow.steps.push({
      stepName: "academicOrganisationStep",
      displayName: "Organisation name",
      stepNumber: 3,
      validation: val => val.pcr,
      stepRender: AcademicOrganisationStep
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

  return workflow;
};
