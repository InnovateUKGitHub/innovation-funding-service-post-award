import { useEffect } from "react";
import { PcrSummaryProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { LoanDrawdownChangeStepName } from "./LoanDrawdownChangeWorkflow";
import { LoanEditTable } from "./LoanEditTable";
import { PCRStepType, PCRItemStatus } from "@framework/constants/pcrConstants";
import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { PCRItemForLoanDrawdownChangeDto } from "@framework/dtos/pcrDtos";
import { ValidationSummary } from "@ui/components/atomicDesign/molecules/validation/ValidationSummary/validationSummary";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { FinancialLoanVirementDtoValidator } from "@ui/validation/validators/financialVirementDtoValidator";
import { PCRLoanDrawdownChangeItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { usePcrSummaryContext } from "../components/PcrSummary/PcrSummary";
import { Loader } from "@ui/components/bjss/loading";

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
      {isClient && <ValidationSummary validation={editor.validator} compressed={false} />}

      <LoanEditTable {...editor} mode="view" onEditLink={props.getEditLink(PCRStepType.loanDrawdownChange, null)} />
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
    <Loader
      pending={loanEditorPending}
      render={loanEditor => <LoanDrawdownChangeUI {...props} editor={loanEditor} />}
    />
  );
};
