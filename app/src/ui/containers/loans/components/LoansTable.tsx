import cx from "classnames";
import type { Loan } from "../loanOverview.logic";
import { useContent } from "@ui/hooks/content.hook";
import { ReactNode } from "react";
import { LoanStatus } from "@framework/entities/loan-status";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Bold } from "@ui/components/renderers/bold";
import { Currency } from "@ui/components/renderers/currency";
import { Button } from "@ui/components/styledButton";
import { createTypedTable } from "@ui/components/table";
import { Link } from "@ui/components/links";

export interface LoansTableProps {
  items: Loan[];
  createLink: (id: LoanId) => ILinkInfo;
  roles: { readonly isMo: boolean; readonly isFc: boolean; readonly isPm: boolean };
}

const Drawdown = createTypedTable<Loan>();
export const LoansTable = ({ items, createLink, roles }: LoansTableProps) => {
  const { getContent } = useContent();

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
      <Drawdown.String
        header={getContent(x => x.components.loansTable.drawdown)}
        qa="drawdown-period"
        value={x => `${x.period}`}
      />

      <Drawdown.FullNumericDate
        header={getContent(x => x.components.loansTable.dueDate)}
        qa="drawdown-date"
        value={x => x.requestDate}
      />

      <Drawdown.Custom
        header={getContent(x => x.components.loansTable.drawdownAmount)}
        qa="drawdown-forecast-amount"
        classSuffix="numeric"
        value={x => (
          <Bold>
            <Currency fractionDigits={0} value={x.forecastAmount} />
          </Bold>
        )}
      />

      <Drawdown.String
        header={getContent(x => x.components.loansTable.status)}
        qa="drawdown-status"
        value={x => x.status}
      />

      <Drawdown.Custom
        qa="drawdown-action"
        value={({ id }) => {
          const nextPlannedLoan = nextLoan?.id === id;

          return (
            nextPlannedLoan &&
            !roles.isMo && (
              <LoanRequestButton route={createLink(nextLoan.id)} disabled={!canRequestLoan}>
                {/* FC can request */}
                {roles.isFc && getContent(x => x.components.loansTable.request)}
                {/* PM can view, Hybrid FC/PM cannot view (they can request) */}
                {roles.isPm && !roles.isFc && getContent(x => x.components.loansTable.view)}
              </LoanRequestButton>
            )
          );
        }}
      />
    </Drawdown.Table>
  );
};

interface LoanRequestButtonProps {
  disabled: boolean;
  route: ILinkInfo;
  children: ReactNode;
}

const LoanRequestButton = ({ disabled, route, children }: LoanRequestButtonProps) => {
  return disabled ? (
    <Button disabled styling="Primary" className="govuk-!-margin-bottom-0">
      {children}
    </Button>
  ) : (
    <Link route={route} styling="PrimaryButton" className="govuk-!-margin-bottom-0">
      {children}
    </Link>
  );
};
