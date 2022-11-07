import { LoanDto } from "@framework/dtos";

import * as ACC from "@ui/components";

// Note: The totals property has to be required to render the table
type LoanTableProps = Required<LoanDto>;

export const LoanRequestTable = (props: LoanTableProps) => {
  const Request = ACC.TypedTable<typeof props>();

  return (
    <Request.Table data={[props]} qa="drawdown-request" className="loan-table">
      <Request.String header="Drawdown" qa="drawdown-request-period" value={x => `${x.period}`} />

      <Request.FullNumericDate header="Due date" qa="drawdown-request-date" value={x => x.requestDate} />

      <Request.Currency
        header="Drawdown forecast"
        qa="drawdown-request-amount"
        fractionDigits={0}
        value={x => x.forecastAmount}
      />

      <Request.Currency
        header="Total loan"
        qa="drawdown-request-total"
        fractionDigits={0}
        value={x => x.totals.totalLoan}
      />

      <Request.Currency
        header="Drawdown to date"
        qa="drawdown-request-paid-to-date"
        fractionDigits={0}
        value={x => x.totals.totalPaidToDate}
      />

      <Request.Custom
        header="Drawdown amount"
        qa="drawdown-request-paid-to-date"
        classSuffix="numeric"
        value={x => (
          <ACC.Renderers.Bold>
            <ACC.Renderers.Currency fractionDigits={0} value={x.amount} />
          </ACC.Renderers.Bold>
        )}
      />

      <Request.Currency
        header="Remaining loan"
        qa="drawdown-request-paid-to-date"
        fractionDigits={0}
        value={x => x.totals.remainingLoan}
      />
    </Request.Table>
  );
};
