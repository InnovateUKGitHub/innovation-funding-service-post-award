import React from "react";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { RoleAndOrganisationStep } from "@ui/containers/pcrs/addPartner/roleAndOrganisationStep";
import { AddPartnerSummary } from "@ui/containers/pcrs/addPartner/addPartnerSummary";

export type addPartnerStepNames = "roleAndOrganisationStep";

export const addPartnerWorkflow: IPCRWorkflow<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> = {
  steps: [
    {
      stepName: "roleAndOrganisationStep",
      displayName: "New partner information",
      stepNumber: 1,
      validation: val => val.pcr,
      stepRender: RoleAndOrganisationStep
    },
  ],
  summary: {
    validation: val => val,
    summaryRender: (props) => <AddPartnerSummary {...props}/>
  }
};
