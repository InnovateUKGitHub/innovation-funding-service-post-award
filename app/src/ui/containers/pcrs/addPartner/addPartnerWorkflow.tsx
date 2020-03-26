import React from "react";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { RoleAndOrganisationStep } from "@ui/containers/pcrs/addPartner/roleAndOrganisationStep";
import { AddPartnerSummary } from "@ui/containers/pcrs/addPartner/addPartnerSummary";
import { PCRPartnerType } from "@framework/constants";
import { AcademicOrganisationStep } from "@ui/containers/pcrs/addPartner/academicOrganisationStep";
import { ProjectLocationStep } from "@ui/containers/pcrs/addPartner/projectLocationStep";
import { FinanceContactStep } from "@ui/containers/pcrs/addPartner/financeContactStep";
import { OrganisationDetailsStep } from "@ui/containers/pcrs/addPartner/organisationDetailsSteps";

export type addPartnerStepNames = "roleAndOrganisationStep" | "academicOrganisationStep" | "organisationDetailsStep" | "projectLocationStep" | "financeContactStep";

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
        stepName: "projectLocationStep",
        displayName: "Project location",
        stepNumber: 5,
        validation: val => val.pcr,
        stepRender: ProjectLocationStep,
      },{
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
