import cx from "classnames";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { useMemo } from "react";
import {
  LoanDrawdownExtensionErrors,
  calculateOffsetDate,
  createOptions,
  getQuarterInMonths,
} from "./loanDrawdownExtension.logic";
import { useContent } from "@ui/hooks/content.hook";
import { TBody, TD, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { FullNumericDate } from "@ui/components/atomicDesign/atoms/Date";
import { DropdownSelect } from "@ui/components/atomicDesign/atoms/form/Dropdown/Dropdown";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { LoanDrawdownExtensionSchema } from "./loanDrawdownExtension.zod";
import { EditLink } from "../pcrItemSummaryLinks";
import { PCRStepType } from "@framework/constants/pcrConstants";

const totalMonths = 75;

const getNewDate = (
  phaseId: "availabilityPeriodChange" | "extensionPeriodChange" | "repaymentPeriodChange",
  formState: {
    availabilityPeriodChange: string;
    extensionPeriodChange: string;
    repaymentPeriodChange: string;
  },
  startDate: Date | null,
) => {
  switch (phaseId) {
    case "availabilityPeriodChange":
      return calculateOffsetDate(Number(formState.availabilityPeriodChange), startDate);
    case "extensionPeriodChange":
      return calculateOffsetDate(
        Number(formState.availabilityPeriodChange) + Number(formState.extensionPeriodChange),
        startDate,
      );
    case "repaymentPeriodChange":
      return calculateOffsetDate(
        Number(formState.availabilityPeriodChange) +
          Number(formState.extensionPeriodChange) +
          Number(formState.repaymentPeriodChange),
        startDate,
      );
  }
};

export const LoanDrawdownTable = ({
  pcrItem,
  watch,
  register,
  isFetching,
  readonlyTable,
  validationErrors,
}: {
  pcrItem: Pick<
    FullPCRItemDto,
    | "availabilityPeriod"
    | "availabilityPeriodChange"
    | "extensionPeriod"
    | "extensionPeriodChange"
    | "repaymentPeriod"
    | "repaymentPeriodChange"
    | "projectStartDate"
  >;
  watch: UseFormWatch<LoanDrawdownExtensionSchema>;
  register: UseFormRegister<LoanDrawdownExtensionSchema>;
  isFetching: boolean;
  readonlyTable?: boolean;
  validationErrors?: LoanDrawdownExtensionErrors;
}) => {
  const { getContent } = useContent();
  const data = useMemo(
    () =>
      [
        {
          label: getContent(x => x.forms.pcr.loanDrawdownExtension.availabilityPeriodChange.label),
          phaseId: "availabilityPeriodChange",
          currentLength: pcrItem.availabilityPeriod ?? 0,
          currentEndDate: calculateOffsetDate(pcrItem.availabilityPeriod ?? 0, pcrItem.projectStartDate),
          newLength: pcrItem.availabilityPeriodChange ?? 0,
          newEndDateOptions: createOptions(pcrItem.availabilityPeriod ?? 0, totalMonths),
        },
        {
          label: getContent(x => x.forms.pcr.loanDrawdownExtension.extensionPeriodChange.label),
          phaseId: "extensionPeriodChange",
          currentLength: pcrItem.extensionPeriod ?? 0,
          currentEndDate: calculateOffsetDate(
            (pcrItem.availabilityPeriod ?? 0) + (pcrItem.extensionPeriod ?? 0),
            pcrItem.projectStartDate,
          ),
          newLength: pcrItem.extensionPeriodChange ?? 0,
          newEndDateOptions: createOptions(pcrItem.extensionPeriod ?? 0, totalMonths),
        },
        {
          label: getContent(x => x.forms.pcr.loanDrawdownExtension.repaymentPeriodChange.label),
          phaseId: "repaymentPeriodChange",
          currentLength: pcrItem.repaymentPeriod ?? 0,
          currentEndDate: calculateOffsetDate(
            (pcrItem.availabilityPeriod ?? 0) + (pcrItem.extensionPeriod ?? 0) + (pcrItem.repaymentPeriod ?? 0),
            pcrItem.projectStartDate,
          ),
          newLength: pcrItem.repaymentPeriodChange ?? 0,
          newEndDateOptions: createOptions(pcrItem.repaymentPeriod ?? 0, totalMonths),
        },
      ] as const,
    [],
  );

  return (
    <Table aria-label="Change loan duration table">
      <THead>
        <TH>{getContent(x => x.pages.pcrModifyOptions.loanDrawdownExtensionTableHeadings.phase)}</TH>
        <TH>{getContent(x => x.pages.pcrModifyOptions.loanDrawdownExtensionTableHeadings.currentLength)}</TH>
        <TH>{getContent(x => x.pages.pcrModifyOptions.loanDrawdownExtensionTableHeadings.currentEndDate)}</TH>
        <TH>{getContent(x => x.pages.pcrModifyOptions.loanDrawdownExtensionTableHeadings.newLength)}</TH>
        <TH>{getContent(x => x.pages.pcrModifyOptions.loanDrawdownExtensionTableHeadings.newEndDate)}</TH>
      </THead>
      <TBody>
        {data.map(x => (
          <TR key={x.label} id={x.phaseId}>
            <TD>{x.label}</TD>
            <TD>{getQuarterInMonths(x.currentLength)}</TD>
            <TD>
              <FullNumericDate value={x.currentEndDate} />
            </TD>
            <TD>
              {readonlyTable ? (
                <P>{getQuarterInMonths(x.newLength)}</P>
              ) : (
                <DropdownSelect
                  className={cx({
                    "loan-table__cell--date-error":
                      !!validationErrors?.loanDrawdownExtension || !!validationErrors?.[x.phaseId],
                  })}
                  disabled={isFetching}
                  options={x.newEndDateOptions}
                  {...register(x.phaseId)}
                  defaultValue={String(pcrItem[x.phaseId])}
                />
              )}
            </TD>
            <TD>
              {String(x.currentLength) === watch(x.phaseId) ? (
                <P>-</P>
              ) : (
                <FullNumericDate value={getNewDate(x.phaseId, watch(), pcrItem.projectStartDate)} />
              )}
            </TD>
            {readonlyTable && (
              <TD>
                <EditLink stepName={PCRStepType.loanExtension} />
              </TD>
            )}
          </TR>
        ))}
      </TBody>
    </Table>
  );
};
