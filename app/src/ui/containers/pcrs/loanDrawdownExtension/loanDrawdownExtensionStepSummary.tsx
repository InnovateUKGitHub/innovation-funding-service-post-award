import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForLoanDrawdownExtensionDto } from "@framework/dtos";
import { PCRLoanExtensionItemDtoValidator } from "@ui/validators";

import { LoanExtensionStepNames } from "./loanDrawdownExtensionWorkflow";
import { LoanChangeDurationTable } from "./LoanChangeDurationTable";

type BaseProps = PcrSummaryProps<
  PCRItemForLoanDrawdownExtensionDto,
  PCRLoanExtensionItemDtoValidator,
  LoanExtensionStepNames
>;

export const loanDrawdownExtensionStepSummary = ({ routes, config, ...props }: BaseProps) => {
  // TODO: Check interface, this should always be a Date or throw error in server
  if (!props.pcrItem.projectStartDate) {
    throw Error("Missing start date");
  }

  return (
    <LoanChangeDurationTable
      formData={props.pcrItem}
      validator={props.validator}
      editLink={props.getEditLink("loanExtension", null)}
    />
  );
};
