import React from "react";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos";
import { NameChangeStep } from "@ui/containers/pcrs/nameChange/nameChangeStep";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { PCRPrepareItemFilesStep } from "@ui/containers/pcrs/nameChange/prepareItemFilesStep";
import { NameChangeSummary } from "@ui/containers/pcrs/nameChange/summary";
import { IStep, StepProps, WorkFlow } from "@ui/containers/pcrs/workflow";

export interface AccountNameChangeStep extends IStep<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> {
  stepName: "partnerNameStep" | "filesStep";
  stepNumber: 1|2;
  stepRender: (props: StepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator>) => React.ReactNode;
}

export class AccountNameChangeWorkflow extends WorkFlow<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> {
  constructor(stepNumber: AccountNameChangeStep["stepNumber"]) {
    super({  steps: [{
        stepName: "partnerNameStep",
        stepNumber: 1,
        stepRender: (props) => <NameChangeStep {...props}/>
      }, {
        stepName: "filesStep",
        stepNumber: 2,
        stepRender: (props) => <PCRPrepareItemFilesStep {...props}/>
      }],
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
      }}, stepNumber);
  }
}
