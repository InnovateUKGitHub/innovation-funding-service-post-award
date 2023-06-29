import { LoanDto } from "@framework/dtos/loanDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { LoadingMessage } from "@ui/components/bjss/loading";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { getPending } from "@ui/helpers/get-pending";
import { useStores } from "@ui/redux/storesProvider";

type ProjectOptions = Pick<ProjectDto, "id" | "competitionType">;

export interface ClaimDrawdownTableProps extends ProjectOptions {
  /** @description Current project period number could be ahead/behind of the claim period  */
  requiredPeriod: number;
}

const PeriodDrawdownTable = createTypedTable<Required<LoanDto>>();

const useClaimDrawdown = (props: ClaimDrawdownTableProps) => {
  const { isLoans } = checkProjectCompetition(props.competitionType);
  const stores = useStores();

  // Note: Only drawdowns can display drawdown data
  if (!isLoans) return null;

  const loanQuery = stores.loans.get(props.id, undefined, props.requiredPeriod);
  const { error, ...rest } = getPending(loanQuery);

  if (error?.message === "No loan found.") return null;

  if (rest.isRejected) throw Error(error?.message ?? "There was an error fetching data within ClaimDrawdownTable");

  // Note: We require total values for the UI
  if (rest.payload && rest.payload.totals === undefined) throw Error("Loan totals must be available.");

  const isLoading = !rest.payload || rest.isLoading;

  return {
    ...rest,
    isLoading,
  };
};

export const ClaimDrawdownTable = (props: ClaimDrawdownTableProps) => {
  const claimDrawdown = useClaimDrawdown(props);

  if (!claimDrawdown) return null;

  if (claimDrawdown.isLoading) return <LoadingMessage />;

  return (
    <PeriodDrawdownTable.Table qa="period-loan-table" data={[claimDrawdown.payload as Required<LoanDto>]}>
      <PeriodDrawdownTable.Custom header="Current drawdown" qa="drawdown-id" value={x => x.period} />

      <PeriodDrawdownTable.Currency header="Total loan amount" qa="drawdown-amount" value={x => x.totals.totalLoan} />

      <PeriodDrawdownTable.Currency
        header="Drawdowns to date"
        qa="drawdown-totals-todate"
        value={x => x.totals.totalPaidToDate}
      />

      <PeriodDrawdownTable.Currency header="Drawdown this period" qa="drawdown-current-amount" value={x => x.amount} />

      <PeriodDrawdownTable.Currency
        header="Remaining loan amount"
        qa="drawdown-remaining-amount"
        value={x => x.totals.remainingLoan}
      />
    </PeriodDrawdownTable.Table>
  );
};
