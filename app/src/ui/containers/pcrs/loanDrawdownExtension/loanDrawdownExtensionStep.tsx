import { useState } from "react";
import { PCRItemForLoanDrawdownExtensionDto } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRLoanExtensionItemDtoValidator } from "@ui/validators";
import { formatDate } from "@framework/util";
import { DateFormat } from "@framework/constants";
import { EditorStatus } from "@ui/constants/enums";

import * as ACC from "@ui/components";

import { LoanChangeDurationTable } from "./LoanChangeDurationTable";

type LoanDrawdownExtensionStepProps = PcrStepProps<
  PCRItemForLoanDrawdownExtensionDto,
  PCRLoanExtensionItemDtoValidator
>;

const LoanForm = ACC.createTypedForm<PCRItemForLoanDrawdownExtensionDto>();

export const LoanDrawdownExtensionStepContainer = (props: LoanDrawdownExtensionStepProps) => {
  const [state, setState] = useState<PCRItemForLoanDrawdownExtensionDto>(props.pcrItem);

  if (!props.pcrItem.projectStartDate) throw Error("A project start is required");

  const handleOnUpdate = (data: any): void => {
    const latestState = { ...state, ...data };

    setState(latestState);

    props.onChange(latestState);
  };

  const formattedStartDate = formatDate(props.pcrItem.projectStartDate, DateFormat.SHORT_DATE);

  const isDisabled = props.status === EditorStatus.Saving;

  return (
    <>
      <ACC.Renderers.SimpleString>
        You can request a change to the duration of the phases of your loans project.
      </ACC.Renderers.SimpleString>

      <ACC.Renderers.SimpleString>Project start date: {formattedStartDate}</ACC.Renderers.SimpleString>

      <LoanForm.Form qa="loanEditForm" data={state} onSubmit={() => props.onSave(false)}>
        <LoanForm.Custom
          name="loanChangeDurationTable"
          value={({ formData }) => (
            <LoanChangeDurationTable
              editMode
              isDisabled={isDisabled}
              validator={props.validator}
              onUpdate={handleOnUpdate}
              formData={formData}
            />
          )}
        />

        <LoanForm.SubmitAndContinue name="changeLoanEdit" disabled={isDisabled} />
      </LoanForm.Form>
    </>
  );
};
