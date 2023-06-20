import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { LoanFinancialVirement } from "@framework/entities/financialVirement";
import { FullDateInput } from "@ui/components/inputs/dateInput";
import { NumberInput } from "@ui/components/inputs/numberInput";
import { getCurrency, Currency } from "@ui/components/renderers/currency";
import { FullNumericDate } from "@ui/components/renderers/date";
import { createTypedTable } from "@ui/components/table";
import { EditorStatus } from "@ui/constants/enums";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { FinancialLoanVirementDtoValidator } from "@ui/validators/financialVirementDtoValidator";
import cx from "classnames";

type LoanEditStore = IEditorStore<FinancialLoanVirementDto, FinancialLoanVirementDtoValidator>;

interface LoanEditTableEditProps {
  mode: "edit";
  onEdit: (dto: FinancialLoanVirementDto) => void;
  onEditLink?: never;
}

interface LoanEditTableViewProps {
  mode: "view";
  onEditLink: React.ReactNode;
  onEdit?: never;
}

type LoanEditTableProps = LoanEditStore & (LoanEditTableEditProps | LoanEditTableViewProps);

const LoanEdit = createTypedTable<LoanFinancialVirement>();

export const LoanEditTable = ({ data, validator, status, mode, onEdit, onEditLink }: LoanEditTableProps) => {
  const isEditMode = mode === "edit";
  const isViewMode = mode === "view";
  const isDisabled = status === EditorStatus.Saving;

  const preparePayload = (loans: FinancialLoanVirementDto["loans"]): void => {
    const updatedPayload = { ...data, loans };

    // TODO: Refactor and include 'mode' check, tsc should understand the conditional type above rather than checking the callback
    onEdit?.(updatedPayload);
  };

  const handleValueChange = (periodToUpdate: number, updatedValue: number | null): void => {
    if (!updatedValue) return;

    const updatedLoans = data.loans.map(x => {
      const newValue = x.period === periodToUpdate ? updatedValue : x.newValue;

      return { ...x, newValue };
    });

    preparePayload(updatedLoans);
  };

  const handleDateChange = (periodToUpdate: number, updatedDate: Date | null): void => {
    if (!updatedDate) return;

    const isDateInValid = isNaN(updatedDate?.getTime());

    // Ignore edge cases
    if (isDateInValid) return;

    const updatedLoans = data.loans.map(x => {
      const newDate = x.period === periodToUpdate ? updatedDate : x.newDate;

      return { ...x, newDate };
    });

    preparePayload(updatedLoans);
  };

  return (
    <LoanEdit.Table
      qa="loan-edit-table"
      data={data.loans}
      bodyRowClass={(x, rowIndex) =>
        cx("loan-table_row", {
          "loan-table__row--is-editable": x.isEditable,
          "table__row--error":
            x.isEditable && (!validator.totalValue.isValid || !validator.items.results[rowIndex].isValid),
        })
      }
    >
      <LoanEdit.String header="Drawdown" qa="loan-id" value={x => `${x.period}`} footer="Total" />

      <LoanEdit.FullDate header="Current date" qa="loan-current-date" value={x => x.currentDate} />

      <LoanEdit.Currency
        header="Current amount"
        qa="loan-current-amount"
        value={x => x.currentValue}
        footer={getCurrency(validator.totals.currentTotal)}
      />

      <LoanEdit.Custom
        header="New date"
        qa="loan-new-date"
        cellClassName={(x, { row }) => {
          const validationItem = validator.items.results[row];
          const { isValid: newDateIsValid, showValidationErrors } = validationItem.newDate;

          const isNewDateInvalid = !newDateIsValid && showValidationErrors;

          return cx({
            "loan-table__cell--error": x.isEditable && isNewDateInvalid,
          });
        }}
        value={(x, { row }) => {
          const validationItem = validator.items.results[row];
          const { key: newDateErrorKey, isValid: newDateIsValid, showValidationErrors } = validationItem.newDate;

          const isNewDateInvalid = !newDateIsValid && showValidationErrors;

          return isEditMode && x.isEditable ? (
            <FullDateInput
              id={newDateIsValid ? undefined : newDateErrorKey}
              name={`${x.period}_newDate`}
              value={x.newDate}
              onChange={updateDate => handleDateChange(x.period, updateDate)}
              hasError={isNewDateInvalid}
              disabled={isDisabled}
            />
          ) : (
            <FullNumericDate value={x.newDate} />
          );
        }}
      />

      <LoanEdit.Custom
        header="New amount"
        qa="loan-new-amount"
        cellClassName={(x, { row }) => {
          const { items, totalValue } = validator;
          const isTotalValueInValid = totalValue.showValidationErrors && !totalValue.isValid;
          const validationItem = items.results[row];
          const { isValid: newValueIsValid, showValidationErrors } = validationItem.newValue;

          const isNewValueInvalid = showValidationErrors && !newValueIsValid;

          return cx({
            "loan-table__cell--error": x.isEditable && (isTotalValueInValid || isNewValueInvalid),
          });
        }}
        value={(x, { row }) => {
          const { items, totalValue } = validator;
          const isTotalValueInValid = totalValue.showValidationErrors && !totalValue.isValid;
          const validationItem = items.results[row];
          const { key: newValueErrorKey, isValid: newValueIsValid, showValidationErrors } = validationItem.newValue;

          const isNewValueInvalid = showValidationErrors && !newValueIsValid;

          return isEditMode && x.isEditable ? (
            <NumberInput
              id={newValueIsValid ? undefined : newValueErrorKey}
              name={`${x.period}_newValue`}
              value={x.newValue}
              ariaLabel={`Period ${x.period} new amount`}
              onChange={updatedValue => handleValueChange(x.period, updatedValue)}
              className={cx("govuk-input--width-10", {
                "loan-table__cell--date-error": isTotalValueInValid || isNewValueInvalid,
              })}
              disabled={isDisabled}
            />
          ) : (
            <Currency value={x.newValue} fractionDigits={0} />
          );
        }}
        footer={
          <Currency
            value={validator.totals.updatedTotal}
            style={{ display: "block" }}
            className="govuk-input--width-10"
            fractionDigits={2}
          />
        }
      />

      {isViewMode ? <LoanEdit.Custom qa="edit-loan" value={x => isViewMode && x.isEditable && onEditLink} /> : null}
    </LoanEdit.Table>
  );
};
