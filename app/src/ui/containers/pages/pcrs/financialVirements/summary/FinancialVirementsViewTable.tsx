import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { Table, THead, TR, TH, TBody, TD, TFoot } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { useContent } from "@ui/hooks/content.hook";
import { MappedFinancialVirements } from "../../utils/useMapFinancialVirements";
import { useRoutes } from "@ui/redux/routesProvider";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";

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
      <THead>
        <TR>
          <TH small className={colClass}>
            {getContent(x => x.financialVirementLabels.partnerName)}
          </TH>
          <TH small numeric>
            {getContent(x => x.financialVirementLabels.partnerOriginalEligibleCosts)}
          </TH>
          <TH small numeric>
            {getContent(x => x.financialVirementLabels.partnerNewEligibleCosts)}
          </TH>
          <TH small numeric className={colClass}>
            {getContent(x => x.financialVirementLabels.partnerDifferenceCosts)}
          </TH>
          <TH small numeric>
            {getContent(x => x.financialVirementLabels.originalFundingLevel)}
          </TH>
          <TH small numeric className={colClass}>
            {getContent(x => x.financialVirementLabels.newFundingLevel)}
          </TH>
          <TH small numeric>
            {getContent(x => x.financialVirementLabels.partnerOriginalRemainingGrant)}
          </TH>
          <TH small numeric>
            {getContent(x => x.financialVirementLabels.partnerNewRemainingGrant)}
          </TH>
          <TH small numeric>
            {getContent(x => x.financialVirementLabels.partnerDifferenceGrant)}
          </TH>
        </TR>
      </THead>
      <TBody>
        {virementData.virements.map(x => (
          <TR key={x.virementParticipantId}>
            <TD small className={colClass}>
              <Link
                route={routes.pcrFinancialVirementDetails.getLink({
                  projectId,
                  partnerId: x.partnerId,
                  itemId,
                  pcrId,
                  mode: mode as "view",
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
            {getContent(x => x.financialVirementLabels.projectTotals)}
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
