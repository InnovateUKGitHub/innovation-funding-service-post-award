import React from "react";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerType } from "@framework/constants";
import {
  AcademicOrganisationStep, AddPartnerSummary,
  FinanceContactStep,
  FinanceDetailsStep,
  OrganisationDetailsStep,
  ProjectLocationStep,
  RoleAndOrganisationStep
} from "@ui/containers/pcrs/addPartner";

export type addPartnerStepNames = "roleAndOrganisationStep" | "academicOrganisationStep" | "organisationDetailsStep" | "projectLocationStep" | "financeContactStep" | "financeDetailsStep";

export const getAddPartnerWorkflow = (item: PCRItemForPartnerAdditionDto, step: number | undefined): IPCRWorkflow<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> => {
  const workflow: IPCRWorkflow<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> = {
    steps: [
      {
        stepName: "organisationDetailsStep",
        displayName: "Organisation details",
        stepNumber: 3,
        validation: val => val.pcr,
        stepRender: OrganisationDetailsStep,
      },
      {
        stepName: "financeDetailsStep",
        displayName: "Financial details",
        stepNumber: 4,
        validation: val => val.pcr,
        stepRender: FinanceDetailsStep,
      },
      {
        stepName: "projectLocationStep",
        displayName: "Project location",
        stepNumber: 5,
        validation: val => val.pcr,
        stepRender: ProjectLocationStep,
      },
      {
        stepName: "financeContactStep",
        displayName: "Finance contact",
        stepNumber: 6,
        validation: val => val.pcr,
        stepRender: FinanceContactStep,
      },
    ],
    summary: {
      validation: val => val,
      summaryRender: (props) => <AddPartnerSummary {...props}/>
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
      stepNumber: 2,
      validation: val => val.pcr,
      stepRender: AcademicOrganisationStep
    });
  }

  return workflow;
};
