import { PCRItemForLoanDrawdownExtensionDto } from "@framework/dtos/pcrDtos";
import { DropdownOption } from "@ui/components/bjss/form/form";
import { DropdownList } from "@ui/components/bjss/inputs/dropdownList";
import { FullNumericDate } from "@ui/components/atomicDesign/atoms/Date";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { Result } from "@ui/validation/result";
import { PCRLoanExtensionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import cx from "classnames";

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

interface LoanEditTableData {
  label: string;
  phaseId: string;
  currentLength: number;
  currentEndDate: Date;
  newLength: number;
  newEndDate: Date;
  validator: Result;
}

const LoanEditTable = createTypedTable<LoanEditTableData>();

export const LoanChangeDurationTable = ({
  editMode = false,
  isDisabled = false,
  editLink,
  onUpdate,
  validator,
  ...props
}: LoanChangeDurationTableProps) => {
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

  // Note: Avoid display stale data - JS gives real dynamic values
  const noDynamicUpdates = isServer && editMode;

  return (
    <LoanEditTable.Table
      qa="loanChangeDuration"
      data={payload}
      bodyRowClass={x => {
        if (!editMode || validator.checkInEditable(x.currentEndDate)) return "";

        return "govuk-table__row--editable";
      }}
    >
      <LoanEditTable.String qa="phase-name" header="Phase" value={x => x.label} />

      <LoanEditTable.Custom
        qa="current-length"
        header="Current length (quarters)"
        cellClassName={() => "govuk-!-text-align-centre"}
        value={x => getQuarterInMonths(x.currentLength)}
      />

      <LoanEditTable.FullNumericDate qa="current-date" header="Current end date" value={x => x.currentEndDate} />

      <LoanEditTable.Custom
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
            <DropdownList
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
        <LoanEditTable.Custom
          qa="new-date"
          header="New end date"
          value={x =>
            x.currentEndDate.getTime() === x.newEndDate.getTime() ? (
              <SimpleString className="govuk-!-margin-0 govuk-!-text-align-centre">-</SimpleString>
            ) : (
              <FullNumericDate value={x.newEndDate} />
            )
          }
        />
      )}

      {editMode ? null : <LoanEditTable.Custom qa="edit-link" header="" value={() => editLink} />}
    </LoanEditTable.Table>
  );
};

const getQuarterInMonths = (totalMonths: number): number => totalMonths / 3;

const getOptions = (data: NoUndefinedField<PCRItemForLoanDrawdownExtensionDto>) => {
  const totalMonths = 75;

  return {
    availabilityPeriod: createOptions(data.availabilityPeriod, totalMonths),
    extensionPeriod: createOptions(data.extensionPeriod, totalMonths),
    repaymentPeriod: createOptions(data.repaymentPeriod, totalMonths),
  };
};

/**
 * Creates a list of options
 */
function createOptions(currentOffset: number, totalMonths: number): DropdownOption[] {
  const quarterlyOffset = 3;
  // Note: Capture any current options which are less than "quarterlyOffset" or not modulo of 3
  const shouldAddStartOption = currentOffset < quarterlyOffset;

  const list = [];

  if (shouldAddStartOption) list.push(createDurationOption(currentOffset));

  for (let newOffset = quarterlyOffset; newOffset <= totalMonths; newOffset += quarterlyOffset) {
    const notCurrentIndex = currentOffset !== newOffset;
    const optionDoesNotExist = currentOffset >= newOffset;
    const shouldAddDefaultOption = currentOffset - newOffset === currentOffset % quarterlyOffset;
    const shouldAddMiddleOption = optionDoesNotExist && shouldAddDefaultOption;

    if (notCurrentIndex) list.push(createDurationOption(newOffset));
    if (shouldAddMiddleOption) list.push(createDurationOption(currentOffset));
  }

  return list;
}

const createDurationOption = (value: number) => {
  const id = String(value);
  const quarterValue = getQuarterInMonths(value);

  const isSingular = quarterValue === 1;
  const quarterPlural = isSingular ? "quarter" : "quarters";

  const displayValue = `${quarterValue} ${quarterPlural}`;

  return {
    id,
    displayName: displayValue,
    value,
  };
};
