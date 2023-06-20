import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { Pending } from "@shared/pending";
import { getPending } from "@ui/helpers/get-pending";
import { EditorStatus } from "@ui/constants/enums";
import { LoanEditTable } from "./LoanEditTable";
import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { PCRItemForLoanDrawdownChangeDto } from "@framework/dtos/pcrDtos";
import { LoanFinancialVirement } from "@framework/entities/financialVirement";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { LoadingMessage } from "@ui/components/loading";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { ValidationSummary } from "@ui/components/validationSummary";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { FinancialLoanVirementDtoValidator } from "@ui/validators/financialVirementDtoValidator";
import { PCRLoanDrawdownChangeItemDtoValidator } from "@ui/validators/pcrDtoValidator";

type LoanDrawdownPcrStepProps = PcrStepProps<PCRItemForLoanDrawdownChangeDto, PCRLoanDrawdownChangeItemDtoValidator>;

interface LoanDrawnDownUi extends Omit<LoanDrawdownPcrStepProps, "onChange"> {
  editor: Pending<IEditorStore<FinancialLoanVirementDto, FinancialLoanVirementDtoValidator>>;

  onChange: (saving: boolean, dto: FinancialLoanVirementDto) => void;
}

const LoanUpdateForm = createTypedForm<LoanFinancialVirement[]>();

/**
 * React Component for Loan Drawdown CHange
 */
function LoanDrawdownChange({ onChange, ...props }: LoanDrawnDownUi) {
  const { isLoading, payload, isRejected, error } = getPending(props.editor);

  if (isRejected || error) {
    return <SimpleString>There was an error getting your drawdown data.</SimpleString>;
  }

  if (!payload || isLoading) return <LoadingMessage />;

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
    <Section qa="uploadFileSection">
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
    </Section>
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
