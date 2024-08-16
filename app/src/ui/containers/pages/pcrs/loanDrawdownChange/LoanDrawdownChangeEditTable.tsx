import cx from "classnames";
import { LoanFinancialVirement } from "@framework/entities/financialVirement";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { FullDate, FullNumericDate } from "@ui/components/atoms/Date";
import { DateInput } from "@ui/components/atoms/DateInputs/DateInput";
import { DateInputGroup } from "@ui/components/atoms/DateInputs/DateInputGroup";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { TableEmptyCell } from "@ui/components/atoms/table/TableEmptyCell/TableEmptyCell";
import { TBody, TH, THead, TR, Table, TD, TFoot } from "@ui/components/atoms/table/tableComponents";
import { useContent } from "@ui/hooks/content.hook";
import { sumBy } from "lodash";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { LoanDrawdownChangeSchema } from "./loanDrawdownChange.zod";
import { parseCurrency } from "@framework/util/numberHelper";

export type LoanDrawdownEditErrors = {
  newValue?: RhfError;
  loans?: { newDate: RhfError; newDate_day: RhfError; newDate_month: RhfError; newDate_year: RhfError }[];
};

export const LoanDrawdownChangeEditTable = ({
  loans,
  register,
  watch,
  disabled,
  errors,
}: {
  loans: LoanFinancialVirement[];
  register: UseFormRegister<LoanDrawdownChangeSchema>;
  watch: UseFormWatch<LoanDrawdownChangeSchema>;
  disabled: boolean;
  errors: LoanDrawdownEditErrors;
}) => {
  const { getContent } = useContent();

  const newTotalValue = sumBy(watch().loans, x => parseCurrency(x.newValue) || 0);

  return (
    <Table>
      <THead>
        <TR>
          <TH>{getContent(x => x.pages.loansRequest.drawdownPeriodLabel)}</TH>
          <TH>{getContent(x => x.pages.loansRequest.currentDateLabel)}</TH>
          <TH>{getContent(x => x.pages.loansRequest.currentAmountLabel)}</TH>
          <TH>{getContent(x => x.pages.loansRequest.newDateLabel)}</TH>
          <TH>{getContent(x => x.pages.loansRequest.newAmountLabel)}</TH>
        </TR>
      </THead>
      <TBody>
        {loans.map((x, i) => {
          return (
            <TR
              id={`loans_${i}_newDate`}
              key={x.period}
              hasError={x.isEditable && !!(errors?.newValue || errors?.loans?.[i]?.newDate)}
              className={cx("loan-table_row", { "loan-table__row--is-editable": x.isEditable })}
            >
              <TD>{x.period}</TD>
              <TD>
                <FullDate value={x.currentDate} />
              </TD>
              <TD numeric>
                <Currency value={x.currentValue} />
              </TD>
              {x.isEditable ? (
                <TD>
                  <DateInputGroup className="govuk-!-margin-bottom-0" hasError={!!errors?.loans?.[i]?.newDate}>
                    <DateInput
                      type="day"
                      id={`loans_${i}_newDate_day`}
                      {...register(`loans.${i}.newDate_day`)}
                      disabled={disabled}
                      hasError={!!errors?.loans?.[i]?.newDate_day}
                    />
                    <DateInput
                      id={`loans_${i}_newDate_month`}
                      type="month"
                      {...register(`loans.${i}.newDate_month`)}
                      disabled={disabled}
                      hasError={!!errors?.loans?.[i]?.newDate_month}
                    />
                    <DateInput
                      id={`loans_${i}_newDate_year`}
                      type="year"
                      {...register(`loans.${i}.newDate_year`)}
                      disabled={disabled}
                      hasError={!!errors?.loans?.[i]?.newDate_year}
                    />
                  </DateInputGroup>
                </TD>
              ) : (
                <TD>
                  <FullNumericDate value={x.newDate} />
                </TD>
              )}
              {x.isEditable ? (
                <TD>
                  <NumberInput
                    className="govuk-input--width-10"
                    hasError={!!errors?.newValue}
                    {...register(`loans.${i}.newValue`)}
                    disabled={disabled}
                  />
                </TD>
              ) : (
                <TD>
                  <Currency value={x.newValue} />
                </TD>
              )}
            </TR>
          );
        })}
      </TBody>
      <TFoot>
        <TR>
          <TH>{getContent(x => x.pages.loansRequest.totalLabel)}</TH>
          <TH>
            <TableEmptyCell />
          </TH>
          <TH numeric>
            <Currency value={sumBy(loans, x => x.currentValue)} />
          </TH>
          <TH>
            <TableEmptyCell />
          </TH>
          <TH numeric>
            <Currency className={cx({ "loan-table__cell--error": !!errors?.newValue })} value={newTotalValue} />
          </TH>
        </TR>
      </TFoot>
    </Table>
  );
};
