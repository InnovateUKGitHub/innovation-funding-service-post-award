import { useEffect } from "react";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { FinancialLoanVirementDto, PCRItemForLoanDrawdownChangeDto } from "@framework/dtos";
import { FinancialLoanVirementDtoValidator, PCRLoanDrawdownChangeItemDtoValidator } from "@ui/validators";
import * as ACC from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRItemStatus, PCRStepId } from "@framework/constants";
import { useMounted } from "@ui/features";

import { usePcrSummaryContext } from "../components/PcrSummary";
import { LoanDrawdownChangeStepName } from "./LoanDrawdownChangeWorkflow";
import { LoanEditTable } from "./LoanEditTable";

type BaseLoanDrawdownSummaryProps = PcrSummaryProps<
  PCRItemForLoanDrawdownChangeDto,
  PCRLoanDrawdownChangeItemDtoValidator,
  LoanDrawdownChangeStepName
>;
interface LoanDrawdownChangeUIProps {
  editor: IEditorStore<FinancialLoanVirementDto, FinancialLoanVirementDtoValidator>;
}

export const LoanDrawdownChangeUI = ({
  editor,
  ...props
}: LoanDrawdownChangeUIProps & BaseLoanDrawdownSummaryProps) => {
  const { isClient } = useMounted();
  const { handleSubmitDisplay } = usePcrSummaryContext();
  const { isValid } = editor.validator;

  useEffect(() => {
    // Note: Dispatch updates pcr parent render to hide submit button if there are errors
    handleSubmitDisplay(isValid);
  }, [isValid, handleSubmitDisplay]);

  return (
    <>
      {isClient && <ACC.ValidationSummary validation={editor.validator} compressed={false} />}

      <LoanEditTable {...editor} mode="view" onEditLink={props.getEditLink(PCRStepId.loanDrawdownChange, null)} />
    </>
  );
};

export const LoanDrawdownChangeSummary = (props: BaseLoanDrawdownSummaryProps) => {
  const stores = useStores();

  const displayValidations =
    props.pcrItem.status === PCRItemStatus.Complete || props.pcrItem.status === PCRItemStatus.Incomplete;

  const forceRefreshEditor = true;
  const loanEditorPending = stores.financialLoanVirements.getFinancialVirementEditor(
    props.projectId,
    props.pcr.id,
    props.pcrItem.id,
    displayValidations,
    forceRefreshEditor,
  );

  return (
    <ACC.Loader
      pending={loanEditorPending}
      render={loanEditor => <LoanDrawdownChangeUI {...props} editor={loanEditor} />}
    />
  );
};
