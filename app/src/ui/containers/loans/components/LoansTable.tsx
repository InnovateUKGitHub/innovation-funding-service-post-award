import cx from "classnames";
import { LoanStatus } from "@framework/entities";
import { ILinkInfo } from "@framework/types";
import * as ACC from "@ui/components";
import type { Loan } from "../loanOverview.logic";

export interface LoansTableProps {
  items: Loan[];
  createLink: (selectedPeriod: string) => ILinkInfo;
  roles: { readonly isMo: boolean; readonly isFc: boolean; readonly isPm: boolean };
}

const Drawdown = ACC.createTypedTable<Loan>();
export const LoansTable = ({ items, createLink, roles }: LoansTableProps) => {
  const nextLoanIndex = items.findIndex(x => x.status === LoanStatus.PLANNED);
  const isFirstLoanRequest = nextLoanIndex === 0;
  const nextLoan = items[nextLoanIndex];
  const previousLoanItem = items[nextLoanIndex - 1];

  const hasPreviousApprovedLoan = previousLoanItem?.status === LoanStatus.APPROVED;

  // Note: The first request will always be available (when PLANNED)
  const canRequestLoan = isFirstLoanRequest ? true : hasPreviousApprovedLoan;

  const getRowClassName = (loan: typeof items[0]) => {
    const isAvailable = nextLoan?.id === loan.id;
    const isLocked = loan.status === LoanStatus.APPROVED;
    const isUnknown = loan.status === LoanStatus.UNKNOWN;

    return cx("loan-table_row", {
      "loan-table_row--available": !isUnknown && isAvailable,
      "loan-table_row--unavailable": !isUnknown && !isLocked && !isAvailable,
      "loan-table_row--locked": isUnknown || (isLocked && !isAvailable),
    });
  };

  return (
    <Drawdown.Table data={items} qa="drawdown-list" className="loan-table" bodyRowClass={getRowClassName}>
      <Drawdown.String header="Drawdown" qa="drawdown-period" value={x => `${x.period}`} />

      <Drawdown.FullNumericDate header="Due date" qa="drawdown-date" value={x => x.requestDate} />

      <Drawdown.Custom
        header="Drawdown Amount"
        qa="drawdown-forecast-amount"
        classSuffix="numeric"
        value={x => (
          <ACC.Renderers.Bold>
            <ACC.Renderers.Currency fractionDigits={0} value={x.forecastAmount} />
          </ACC.Renderers.Bold>
        )}
      />

      <Drawdown.String header="Status" qa="drawdown-status" value={x => x.status} />

      <Drawdown.Custom
        qa="drawdown-action"
        value={({ id }) => {
          const nextPlannedLoan = nextLoan?.id === id;

          return (
            nextPlannedLoan &&
            !roles.isMo && <LoanRequestButton route={createLink(nextLoan.id)} disabled={!canRequestLoan} />
          );
        }}
      />
    </Drawdown.Table>
  );
};

interface LoanRequestButtonProps {
  disabled: boolean;
  route: ILinkInfo;
}

const LoanRequestButton = ({ disabled, route }: LoanRequestButtonProps) => {
  const sharedProps = {
    className: "govuk-!-margin-bottom-0",
    children: "Request",
  };

  return disabled ? (
    <ACC.Button disabled styling="Primary" {...sharedProps} />
  ) : (
    <ACC.Link route={route} styling="PrimaryButton" {...sharedProps} />
  );
};
