import { ProjectDto } from "@framework/dtos/projectDto";

import { useClaimDrawdownTableData } from "./claimDrawdownTable.logic";
import { Table, TBody, TD, TH, THead, TR } from "@ui/components/atoms/table/tableComponents";
import { useContent } from "@ui/hooks/content.hook";
import { Currency } from "@ui/components/atoms/Currency/currency";

type ProjectOptions = Pick<ProjectDto, "id" | "competitionType">;

export interface ClaimDrawdownTableProps extends ProjectOptions {
  /** @description Current project period number could be ahead/behind of the claim period  */
  requiredPeriod: number;
  projectId: ProjectId;
  periodId: PeriodId;
}

export const ClaimDrawdownTable = (props: ClaimDrawdownTableProps) => {
  const { getContent } = useContent();

  const data = useClaimDrawdownTableData(props.projectId, props.periodId);

  return (
    <Table>
      <THead>
        <TR>
          <TH>{getContent(x => x.pages.claimDrawdownTable.currentDrawdown)}</TH>
          <TH>{getContent(x => x.pages.claimDrawdownTable.totalLoanAmount)}</TH>
          <TH>{getContent(x => x.pages.claimDrawdownTable.drawdownsToDate)}</TH>
          <TH>{getContent(x => x.pages.claimDrawdownTable.drawdownThisPeriod)}</TH>
          <TH>{getContent(x => x.pages.claimDrawdownTable.remainingLoanAmount)}</TH>
        </TR>
      </THead>
      <TBody>
        {data.loan.map((x, i) => (
          <TR key={i}>
            <TD data-qa="drawdown-id">{x.period}</TD>
            <TD data-qa="drawdown-amount">
              <Currency value={x.totals.totalLoan} />
            </TD>
            <TD data-qa="drawdown-totals-todate">
              <Currency value={x.totals.totalPaidToDate} />
            </TD>
            <TD data-qa="drawdown-current-amount">
              <Currency value={x.amount} />
            </TD>
            <TD data-qa="drawdown-remaining-amount">
              <Currency value={x.totals.remainingLoan} />
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
};
