import React from "react";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos";
import { NameChangeStep } from "@ui/containers/pcrs/nameChange/nameChangeStep";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { PCRPrepareItemFilesStep } from "@ui/containers/pcrs/nameChange/prepareItemFilesStep";
import { NameChangeSummary } from "@ui/containers/pcrs/nameChange/summary";
import { IWorkflow } from "@ui/containers/pcrs/workflow";

export type accountNameChangeStepNames = "partnerNameStep" | "filesStep";

export const accountNameChangeWorkflow: IWorkflow<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator, accountNameChangeStepNames> = {
  steps: [
    {
      stepName: "partnerNameStep",
      displayName: "Partner details",
      stepNumber: 1,
      stepRender: (props) => <NameChangeStep {...props}/>
    },
    {
      stepName: "filesStep",
      displayName: "Upload change of name certificate",
      stepNumber: 2,
      stepRender: (props) => <PCRPrepareItemFilesStep {...props}/>
    }
  ],
  summaryRender: (props) => {
    const {projectId, validator, pcrItem, pcr, mode, onSave, getStepLink} = props;
    return (
      <NameChangeSummary
        projectId={projectId}
        validator={validator}
        pcrItem={pcrItem}
        pcr={pcr}
        onSave={onSave}
        getStepLink={getStepLink}
        mode={mode}
      />
    );
  }
};
