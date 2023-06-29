import { LoanDto } from "@framework/dtos/loanDto";
import { Bold } from "@ui/components/atomicDesign/atoms/Bold/bold";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";

// Note: The totals property has to be required to render the table
type LoanTableProps = Required<LoanDto>;

const Request = createTypedTable<LoanTableProps>();
export const LoanRequestTable = (props: LoanTableProps) => {
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
          <Bold>
            <Currency fractionDigits={0} value={x.amount} />
          </Bold>
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
