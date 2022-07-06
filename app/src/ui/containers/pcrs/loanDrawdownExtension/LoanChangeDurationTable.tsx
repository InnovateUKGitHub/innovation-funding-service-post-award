import cx from "classnames";

import { PCRItemForLoanDrawdownExtensionDto } from "@framework/dtos";
import { PCRLoanExtensionItemDtoValidator } from "@ui/validators";
import * as ACC from "@ui/components";
import { useMounted } from "@ui/features";

// TODO: Move to generic area
// https://stackoverflow.com/a/53050575
type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};

type BaseChangeDurationTable =
  | {
      editMode?: false;
      isDisabled?: never;
      editLink: React.ReactNode;
      onUpdate?: never;
    }
  | {
      editMode: true;
      isDisabled?: boolean;
      editLink?: never;
      onUpdate: (updatedPayload: Record<string, number>) => void;
    };

type LoanChangeDurationTableProps = BaseChangeDurationTable & {
  formData?: PCRItemForLoanDrawdownExtensionDto;
  validator: PCRLoanExtensionItemDtoValidator;
};

export function LoanChangeDurationTable({
  editMode = false,
  isDisabled = false,
  editLink,
  onUpdate,
  validator,
  ...props
}: LoanChangeDurationTableProps) {
  const { isServer } = useMounted();

  if (!props.formData) throw Error("<LoanChangeDurationTable> must be used with a Form to receive data.");

  // TODO: Investigate a stricter data type
  // Note: Coerce formData, we know it will always have data not 'number | null' data shape
  const formData = props.formData as NoUndefinedField<PCRItemForLoanDrawdownExtensionDto>;

  const payload = [
    {
      label: "Availability Period",
      phaseId: "availabilityPeriodChange",
      currentLength: formData.availabilityPeriod,
      currentEndDate: validator.calculateOffsetDate(formData.availabilityPeriod),
      newLength: formData.availabilityPeriodChange,
      newEndDate: validator.calculateOffsetDate(formData.availabilityPeriodChange),
      validator: validator.availabilityPeriodChange,
    },
    {
      label: "Extension Period",
      phaseId: "extensionPeriodChange",
      currentLength: formData.extensionPeriod,
      currentEndDate: validator.calculateOffsetDate(formData.availabilityPeriod + formData.extensionPeriod),
      newLength: formData.extensionPeriodChange,
      newEndDate: validator.calculateOffsetDate(formData.availabilityPeriodChange + formData.extensionPeriodChange),
      validator: validator.extensionPeriodChange,
    },
    {
      label: "Repayment Period",
      phaseId: "repaymentPeriodChange",
      currentLength: formData.repaymentPeriod,
      currentEndDate: validator.calculateOffsetDate(
        formData.availabilityPeriod + formData.extensionPeriod + formData.repaymentPeriod,
      ),
      newLength: formData.repaymentPeriodChange,
      newEndDate: validator.calculateOffsetDate(
        formData.availabilityPeriodChange + formData.extensionPeriodChange + formData.repaymentPeriodChange,
      ),
      validator: validator.repaymentPeriodChange,
    },
  ];

  const handleUpdate = (phaseIdToUpdate: string, newLength: number) => {
    const latestPayload = {
      // Note: We are working on the assumption the consumer reads the updates in a message bus fashion
      [phaseIdToUpdate]: newLength,
    };

    onUpdate?.(latestPayload);
  };

  const LoanEdit = ACC.TypedTable<typeof payload[0]>();

  // Note: Avoid display stale data - JS gives real dynamic values
  const noDynamicUpdates = isServer && editMode;

  return (
    <LoanEdit.Table
      qa="loanChangeDuration"
      data={payload}
      bodyRowClass={x => {
        if (!editMode || validator.checkInEditable(x.currentEndDate)) return "";

        return "govuk-table__row--editable";
      }}
    >
      <LoanEdit.String qa="phase-name" header="Phase" value={x => x.label} />

      <LoanEdit.Custom
        qa="current-length"
        header="Current length (quarters)"
        cellClassName={() => "govuk-!-text-align-centre"}
        value={x => getQuarterInMonths(x.currentLength)}
      />

      <LoanEdit.FullNumericDate qa="current-date" header="Current end date" value={x => x.currentEndDate} />

      <LoanEdit.Custom
        qa="new-length"
        header="New length (quarters)"
        cellClassName={!editMode ? () => "govuk-!-text-align-centre" : undefined}
        value={(x, { row }) => {
          const isNotEditable = editMode ? validator.checkInEditable(x.currentEndDate) : true;

          if (isNotEditable) return getQuarterInMonths(x.newLength);

          const hasFormError = validator.allPeriods.showValidationErrors && !validator.allPeriods.isValid;
          // Note: If the main error is thrown we want `allPeriods` error to replace the first error
          const hasAllPeriodsError = hasFormError && row === 0;
          const hasInValidPhase = x.validator.showValidationErrors && !x.validator.isValid;
          const hasInValidEntry = hasFormError || hasInValidPhase;

          const allPhaseOptions = getOptions(formData);

          // Note: Remove "change" = "availabilityPeriodChange" => "availabilityPeriod"
          const phaseKey = x.phaseId.slice(0, -6) as keyof typeof allPhaseOptions;
          const phaseOptions = allPhaseOptions[phaseKey];

          return (
            <ACC.Inputs.DropdownList
              id={hasAllPeriodsError ? validator.allPeriods.key : x.validator.key}
              name={x.phaseId}
              options={phaseOptions}
              value={phaseOptions.find(opt => opt.value === x.newLength)}
              onChange={changedOption => changedOption && handleUpdate(x.phaseId, Number(changedOption.value))}
              className={cx({ "loan-table__cell--date-error": hasInValidEntry })}
              disabled={isDisabled}
            />
          );
        }}
      />

      {noDynamicUpdates ? null : (
        <LoanEdit.Custom
          qa="new-date"
          header="New end date"
          value={x =>
            x.currentEndDate.getTime() === x.newEndDate.getTime() ? (
              <ACC.Renderers.SimpleString className="govuk-!-margin-0 govuk-!-text-align-centre">
                -
              </ACC.Renderers.SimpleString>
            ) : (
              <ACC.Renderers.FullNumericDate value={x.newEndDate} />
            )
          }
        />
      )}

      {editMode ? null : <LoanEdit.Custom qa="edit-link" header="" value={() => editLink} />}
    </LoanEdit.Table>
  );
}

const getQuarterInMonths = (totalMonths: number): number => totalMonths / 3;

const getOptions = (data: NoUndefinedField<PCRItemForLoanDrawdownExtensionDto>) => {
  // TODO: Feature flag this loan increase months
  const totalMonths = 75;

  return {
    availabilityPeriod: createOptions(data.availabilityPeriod, totalMonths),
    extensionPeriod: createOptions(data.extensionPeriod, totalMonths),
    repaymentPeriod: createOptions(data.repaymentPeriod, totalMonths),
  };
};

function createOptions(currentOffset: number, totalMonths: number): ACC.DropdownOption[] {
  const quarterlyOffset = 3;
  // Note: Capture any current options which are less than "quarterlyOffset" or not modulas of 3
  const shouldAddStartOption = currentOffset < quarterlyOffset;

  const list = [];

  if (shouldAddStartOption) list.push(createDurationOption(true, currentOffset));

  for (let newOffset = quarterlyOffset; newOffset <= totalMonths; newOffset += quarterlyOffset) {
    const notCurrentIndex = currentOffset !== newOffset;
    const optionDoesNotExist = currentOffset >= newOffset;
    const shouldAddDefaultOption = currentOffset - newOffset === currentOffset % quarterlyOffset;
    const shouldAddMiddleOption = optionDoesNotExist && shouldAddDefaultOption;

    if (notCurrentIndex) list.push(createDurationOption(false, newOffset));
    if (shouldAddMiddleOption) list.push(createDurationOption(true, currentOffset));
  }

  return list;
}

const createDurationOption = (selected: boolean, value: number) => {
  const id = String(value);
  const quarterValue = getQuarterInMonths(value);

  const isSingular = quarterValue === 1;
  const quarterPlural = isSingular ? "quarter" : "quarters";

  const displayValue = `${quarterValue} ${quarterPlural}`;

  return {
    id,
    selected,
    displayName: displayValue,
    value,
  };
};
