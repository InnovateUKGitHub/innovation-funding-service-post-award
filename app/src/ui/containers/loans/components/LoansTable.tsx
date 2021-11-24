import cx from "classnames";

import { LoanStatus } from "@framework/entities";
import { LoanDto } from "@framework/dtos";
import { ILinkInfo } from "@framework/types";

import * as ACC from "@ui/components";

export interface LoansTableProps {
  items: LoanDto[];
  createLink: (selectedPeriod: LoanDto["id"]) => ILinkInfo;
}

export function LoansTable({ items, createLink }: LoansTableProps) {
  const Drawdown = ACC.TypedTable<typeof items[0]>();

  const nextLoan = items.find(x => x.status === LoanStatus.PLANNED);

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
        qa="drawdown-amount"
        classSuffix="numeric"
        value={x => (
          <ACC.Renderers.Bold>
            <ACC.Renderers.Currency fractionDigits={0} value={x.amount} />
          </ACC.Renderers.Bold>
        )}
      />

      <Drawdown.String header="Status" qa="drawdown-status" value={x => x.status} />

      <Drawdown.Custom
        qa="drawdown-action"
        value={({ id }) =>
          nextLoan?.id === id && (
            <ACC.Link styling="PrimaryButton" className="govuk-!-margin-bottom-0" route={createLink(nextLoan.id)}>
              Request
            </ACC.Link>
          )
        }
      />
    </Drawdown.Table>
  );
}
