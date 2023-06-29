import { useState } from "react";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { EditorStatus } from "@ui/redux/constants/enums";
import { LoanChangeDurationTable } from "./LoanChangeDurationTable";
import { DateFormat } from "@framework/constants/enums";
import { PCRItemForLoanDrawdownExtensionDto } from "@framework/dtos/pcrDtos";
import { formatDate } from "@framework/util/dateHelpers";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { PCRLoanExtensionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

type LoanDrawdownExtensionStepProps = PcrStepProps<
  PCRItemForLoanDrawdownExtensionDto,
  PCRLoanExtensionItemDtoValidator
>;

const LoanForm = createTypedForm<PCRItemForLoanDrawdownExtensionDto>();

export const LoanDrawdownExtensionStepContainer = (props: LoanDrawdownExtensionStepProps) => {
  const [state, setState] = useState<PCRItemForLoanDrawdownExtensionDto>(props.pcrItem);

  if (!props.pcrItem.projectStartDate) throw Error("A project start is required");

  const handleOnUpdate = (data: AnyObject): void => {
    const latestState = { ...state, ...data };

    setState(latestState);

    props.onChange(latestState);
  };

  const formattedStartDate = formatDate(props.pcrItem.projectStartDate, DateFormat.SHORT_DATE);

  const isDisabled = props.status === EditorStatus.Saving;

  return (
    <>
      <SimpleString>You can request a change to the duration of the phases of your loans project.</SimpleString>

      <SimpleString>Project start date: {formattedStartDate}</SimpleString>

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
