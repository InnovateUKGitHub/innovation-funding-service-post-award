import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { FinancialLoanVirementDto, PCRItemForLoanDrawdownChangeDto } from "@framework/dtos";
import * as ACC from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import { FinancialLoanVirementDtoValidator, PCRLoanDrawdownChangeItemDtoValidator } from "@ui/validators";
import { getPending } from "@ui/helpers/get-pending";
import { EditorStatus } from "@ui/constants/enums";
import { ValidationSummary } from "@ui/components";
import { LoanEditTable } from "./LoanEditTable";
import { LoanFinancialVirement } from "@framework/entities";

type LoanDrawdownPcrStepProps = PcrStepProps<PCRItemForLoanDrawdownChangeDto, PCRLoanDrawdownChangeItemDtoValidator>;

interface LoanDrawnDownUi extends Omit<LoanDrawdownPcrStepProps, "onChange"> {
  editor: Pending<IEditorStore<FinancialLoanVirementDto, FinancialLoanVirementDtoValidator>>;

  onChange: (saving: boolean, dto: FinancialLoanVirementDto) => void;
}

const LoanUpdateForm = ACC.createTypedForm<LoanFinancialVirement[]>();

/**
 * React Component for Loan Drawdown CHange
 */
function LoanDrawdownChange({ onChange, ...props }: LoanDrawnDownUi) {
  const { isLoading, payload, isRejected, error } = getPending(props.editor);

  if (isRejected || error) {
    return <ACC.Renderers.SimpleString>There was an error getting your drawdown data.</ACC.Renderers.SimpleString>;
  }

  if (!payload || isLoading) return <ACC.LoadingMessage />;

  const handleTableChanges = (dto: FinancialLoanVirementDto): void => {
    // Note: Mutating this value frustrating, however the whole current UI revolves around mutating this data key
    payload.data = dto;

    onChange(false, payload.data);
  };

  const handleSubmit = (): void => {
    onChange(true, payload.data);

    props.onSave(false);
  };

  return (
    <ACC.Section qa="uploadFileSection">
      <ValidationSummary validation={payload.validator} compressed={false} />

      <LoanUpdateForm.Form
        qa="loanEditForm"
        data={payload.data.loans}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={handleSubmit}
      >
        <LoanEditTable {...payload} mode="edit" onEdit={handleTableChanges} />

        <LoanUpdateForm.Submit name="loanEdit">Continue to summary</LoanUpdateForm.Submit>
      </LoanUpdateForm.Form>
    </ACC.Section>
  );
}

export const LoanDrawdownChangeStepContainer = (props: LoanDrawdownPcrStepProps) => {
  const stores = useStores();

  return (
    <LoanDrawdownChange
      {...props}
      editor={stores.financialLoanVirements.getFinancialVirementEditor(
        props.project.id,
        props.pcr.id,
        props.pcrItem.id,
        false,
      )}
      onChange={(saving, dto) =>
        stores.financialLoanVirements.updateFinancialVirementEditor(
          saving,
          props.project.id,
          props.pcr.id,
          props.pcrItem.id,
          dto,
          false,
        )
      }
    />
  );
};
