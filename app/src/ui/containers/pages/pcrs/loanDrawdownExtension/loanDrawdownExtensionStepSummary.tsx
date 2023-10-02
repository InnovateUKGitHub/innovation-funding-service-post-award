import { PcrSummaryProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { LoanExtensionStepNames } from "./loanDrawdownExtensionWorkflow";
import { LoanChangeDurationTable } from "./LoanChangeDurationTable";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForLoanDrawdownExtensionDto } from "@framework/dtos/pcrDtos";
import { PCRLoanExtensionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

type BaseProps = PcrSummaryProps<
  PCRItemForLoanDrawdownExtensionDto,
  PCRLoanExtensionItemDtoValidator,
  LoanExtensionStepNames
>;

export const loanDrawdownExtensionStepSummary = (props: BaseProps) => {
  // TODO: Check interface, this should always be a Date or throw error in server
  if (!props.pcrItem.projectStartDate) {
    throw Error("Missing start date");
  }

  return (
    <LoanChangeDurationTable
      formData={props.pcrItem}
      validator={props.validator}
      editLink={props.getEditLink(PCRStepType.loanExtension, null)}
    />
  );
};
