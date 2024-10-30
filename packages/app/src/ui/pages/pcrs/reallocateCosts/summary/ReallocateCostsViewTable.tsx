import { Currency } from "@ui/components/atoms/Currency/currency";
import { Percentage } from "@ui/components/atoms/Percentage/percentage";
import { Table, THead, TR, TH, TBody, TD, TFoot, TCaption } from "@ui/components/atoms/table/tableComponents";
import { useContent } from "@ui/hooks/content.hook";
import { MappedFinancialVirements } from "../../utils/useMapFinancialVirements";
import { useRoutes } from "@ui/context/routesProvider";
import { Link } from "@ui/components/atoms/Links/links";

interface FinancialVirementsViewTableProps {
  virementData: MappedFinancialVirements["virementData"];
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
  mode: "details" | "review";
}

const colClass = "acc-table__cell-right-border";

const FinancialVirementsViewTable = ({
  virementData,
  projectId,
  pcrId,
  itemId,
  mode,
}: FinancialVirementsViewTableProps) => {
  const { getContent } = useContent();
  const routes = useRoutes();

  return (
    <Table>
      <TCaption hidden>{getContent(x => x.reallocateCostsLabels.tableCaption)}</TCaption>
      <THead>
        <TR>
          <TH small className={colClass}>
            {getContent(x => x.reallocateCostsLabels.partnerName)}
          </TH>
          <TH small numeric>
            {getContent(x => x.reallocateCostsLabels.partnerOriginalEligibleCosts)}
          </TH>
          <TH small numeric>
            {getContent(x => x.reallocateCostsLabels.partnerNewEligibleCosts)}
          </TH>
          <TH small numeric className={colClass}>
            {getContent(x => x.reallocateCostsLabels.partnerDifferenceCosts)}
          </TH>
          <TH small numeric>
            {getContent(x => x.reallocateCostsLabels.originalFundingLevel)}
          </TH>
          <TH small numeric className={colClass}>
            {getContent(x => x.reallocateCostsLabels.newFundingLevel)}
          </TH>
          <TH small numeric>
            {getContent(x => x.reallocateCostsLabels.partnerOriginalRemainingGrant)}
          </TH>
          <TH small numeric>
            {getContent(x => x.reallocateCostsLabels.partnerNewRemainingGrant)}
          </TH>
          <TH small numeric>
            {getContent(x => x.reallocateCostsLabels.partnerDifferenceGrant)}
          </TH>
        </TR>
      </THead>
      <TBody>
        {virementData.partners.map(x => (
          <TR key={x.virementParticipantId}>
            <TD small className={colClass}>
              <Link
                route={routes.pcrReallocateCostsDetails.getLink({
                  projectId,
                  partnerId: x.partnerId,
                  itemId,
                  pcrId,
                  mode,
                })}
              >
                {x.isLead ? getContent(y => y.partnerLabels.leadPartner({ name: x.name })) : x.name}
              </Link>
            </TD>
            <TD small numeric>
              <Currency value={x.originalEligibleCosts} />
            </TD>
            <TD small numeric>
              <Currency value={x.newEligibleCosts} />
            </TD>
            <TD small numeric className={colClass}>
              <Currency value={x.costDifference} />
            </TD>
            <TD small numeric>
              <Percentage value={x.originalFundingLevel} />
            </TD>
            <TD small numeric className={colClass}>
              <Percentage value={x.newFundingLevel} />
            </TD>
            <TD small numeric>
              <Currency value={x.originalRemainingGrant} />
            </TD>
            <TD small numeric>
              <Currency value={x.newRemainingGrant} />
            </TD>
            <TD small numeric>
              <Currency value={x.grantDifference} />
            </TD>
          </TR>
        ))}
      </TBody>
      <TFoot>
        <TR>
          <TH small className={colClass}>
            {getContent(x => x.reallocateCostsLabels.projectTotals)}
          </TH>
          <TH small numeric>
            <Currency value={virementData.originalEligibleCosts} />
          </TH>
          <TH small numeric>
            <Currency value={virementData.newEligibleCosts} />
          </TH>
          <TH small numeric className={colClass}>
            <Currency value={virementData.costDifference} />
          </TH>
          <TH small numeric>
            <Percentage value={virementData.originalFundingLevel} />
          </TH>
          <TH small numeric className={colClass}>
            <Percentage value={virementData.newFundingLevel} />
          </TH>
          <TH small numeric>
            <Currency value={virementData.originalRemainingGrant} />
          </TH>
          <TH small numeric>
            <Currency value={virementData.newRemainingGrant} />
          </TH>
          <TH small numeric>
            <Currency value={virementData.grantDifference} />
          </TH>
        </TR>
      </TFoot>
    </Table>
  );
};

export { FinancialVirementsViewTable };
