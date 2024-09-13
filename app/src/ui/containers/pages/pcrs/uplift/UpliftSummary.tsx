import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useUpliftSummaryQuery } from "./UpliftSummary.logic";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { useContent } from "@ui/hooks/content.hook";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { PcrBackLink, PcrPage } from "../pcrPage";
import { FinancialVirementsViewTable } from "../reallocateCosts/summary/FinancialVirementsViewTable";
import { useMapFinancialVirements } from "../utils/useMapFinancialVirements";
import { BackLink } from "@ui/components/atoms/Links/links";
import { useRoutes } from "@ui/context/routesProvider";

const UpliftSummary = () => {
  const { projectId, pcrId, itemId, mode } = usePcrWorkflowContext();
  const routes = useRoutes();

  if (mode === "prepare") throw new Error("This page does not support the prepare mode");

  const {
    pcr,
    pcrItemCount,
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
  } = useUpliftSummaryQuery({
    projectId,
    pcrId,
    pcrItemId: itemId,
  });
  const { getContent } = useContent();

  const { virementData } = useMapFinancialVirements({
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
    pcrItemId: itemId,
  });

  return (
    <PcrPage
      validationErrors={undefined}
      backLink={
        pcrItemCount === 1 ? (
          <BackLink route={routes.pcrsDashboard.getLink({ projectId })}>
            {getContent(x => x.pages.pcrOverview.backToPcrs)}
          </BackLink>
        ) : (
          <PcrBackLink />
        )
      }
    >
      <SummaryList qa="pcr_reasoning">
        <SummaryListItem label={x => x.pcrLabels.requestNumber} content={pcr.requestNumber} qa="numberRow" />
        <SummaryListItem
          label={x => x.pcrLabels.type({ count: pcr.items.length })}
          content={getContent(x => x.pcrTypes.uplift)}
          qa="typesRow"
        />
        <SummaryListItem
          label={x => x.pcrUpliftLabels.reasoningComments}
          content={
            <SimpleString multiline verticalScrollbar>
              {pcr.reasoningComments}
            </SimpleString>
          }
          qa="reasoningComments"
        />
      </SummaryList>

      <FinancialVirementsViewTable
        virementData={virementData}
        projectId={projectId}
        pcrId={pcrId}
        itemId={itemId}
        mode={mode}
      />
    </PcrPage>
  );
};

export { UpliftSummary };
