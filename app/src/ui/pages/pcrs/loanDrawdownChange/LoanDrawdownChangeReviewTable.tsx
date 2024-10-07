import cx from "classnames";
import { LoanFinancialVirement } from "@framework/entities/financialVirement";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { FullDate, FullNumericDate } from "@ui/components/atoms/Date";
import { TableEmptyCell } from "@ui/components/atoms/table/TableEmptyCell/TableEmptyCell";
import { TBody, TH, THead, TR, Table, TD, TFoot, TCaption } from "@ui/components/atoms/table/tableComponents";
import { useContent } from "@ui/hooks/content.hook";
import { sumBy } from "lodash";
import { EditLink } from "../pcrItemSummaryLinks";
import { PCRStepType } from "@framework/constants/pcrConstants";

export type LoanDrawdownErrors = {
  newValue?: RhfError;
  loans?: { newDate: RhfError }[];
};

export const LoanDrawdownChangeReviewTable = ({
  loans,
  errors,
}: {
  loans: LoanFinancialVirement[];
  errors: LoanDrawdownErrors;
}) => {
  const { getContent } = useContent();

  const newTotalValue = sumBy(loans, x => x.newValue);

  return (
    <Table>
      <TCaption hidden>{getContent(x => x.pages.loansRequest.tableCaption)}</TCaption>
      <THead>
        <TR>
          <TH>{getContent(x => x.pages.loansRequest.drawdownPeriodLabel)}</TH>
          <TH>{getContent(x => x.pages.loansRequest.currentDateLabel)}</TH>
          <TH numeric>{getContent(x => x.pages.loansRequest.currentAmountLabel)}</TH>
          <TH>{getContent(x => x.pages.loansRequest.newDateLabel)}</TH>
          <TH>{getContent(x => x.pages.loansRequest.newAmountLabel)}</TH>
          <TH>
            <TableEmptyCell />
          </TH>
        </TR>
      </THead>
      <TBody>
        {loans.map((x, i) => {
          return (
            <TR
              key={x.period}
              className="loan-table_row"
              hasError={x.isEditable && !!(errors?.newValue || errors?.loans?.[i]?.newDate)}
            >
              <TD>{x.period}</TD>
              <TD>
                <FullDate value={x.currentDate} />
              </TD>
              <TD numeric>
                <Currency value={x.currentValue} />
              </TD>

              <TD
                id={`loans_${i}_newDate`}
                className={cx({ "loan-table__cell--error": !!(x.isEditable && errors?.loans?.[i]?.newDate) })}
              >
                <FullNumericDate value={x.newDate} />
              </TD>

              <TD className={cx({ "loan-table__cell--error": !!(x.isEditable && errors?.newValue) })}>
                <Currency value={x.newValue} />
              </TD>

              <TD>{x.isEditable ? <EditLink stepName={PCRStepType.loanDrawdownChange} /> : <TableEmptyCell />}</TD>
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
          <TH id="newValue">
            <Currency className={cx({ "loan-table__cell--error": !!errors?.newValue })} value={newTotalValue} />
          </TH>
          <TH>
            <TableEmptyCell />
          </TH>
        </TR>
      </TFoot>
    </Table>
  );
};
