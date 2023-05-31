import cx from "classnames";
import { LoanStatus } from "@framework/entities";
import { ILinkInfo } from "@framework/types";
import * as ACC from "@ui/components";
import type { Loan } from "../loanOverview.logic";
import { useContent } from "@ui/hooks";
import { ReactNode } from "react";

export interface LoansTableProps {
  items: Loan[];
  createLink: (id: LoanId) => ILinkInfo;
  roles: { readonly isMo: boolean; readonly isFc: boolean; readonly isPm: boolean };
}

const Drawdown = ACC.createTypedTable<Loan>();
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
          <ACC.Renderers.Bold>
            <ACC.Renderers.Currency fractionDigits={0} value={x.forecastAmount} />
          </ACC.Renderers.Bold>
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
                {roles.isFc && getContent(x => x.components.loansTable.request)}
                {roles.isPm && getContent(x => x.components.loansTable.view)}
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
    <ACC.Button disabled styling="Primary" className="govuk-!-margin-bottom-0">
      {children}
    </ACC.Button>
  ) : (
    <ACC.Link route={route} styling="PrimaryButton" className="govuk-!-margin-bottom-0">
      {children}
    </ACC.Link>
  );
};
