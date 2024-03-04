import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useUpliftSummaryQuery } from "./UpliftSummary.logic";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { useContent } from "@ui/hooks/content.hook";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { PcrBackLink, PcrPage } from "../pcrPage";
import { FinancialVirementsViewTable } from "../financialVirements/summary/FinancialVirementsViewTable";
import { useMapFinancialVirements } from "../utils/useMapFinancialVirements";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { useRoutes } from "@ui/redux/routesProvider";

const UpliftSummary = () => {
  const { projectId, pcrId, itemId, mode } = usePcrWorkflowContext();
  const routes = useRoutes();

  if (mode === "prepare") throw new Error("This page does not support the prepare mode");

  const { pcr, pcrItemCount, financialVirementsForCosts, financialVirementsForParticipants, partners } =
    useUpliftSummaryQuery({
      projectId,
      pcrId,
      pcrItemId: itemId,
    });
  const { getContent } = useContent();

  const { virementData } = useMapFinancialVirements({
    financialVirementsForCosts,
    financialVirementsForParticipants,
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
          label={x => x.pcrUpliftLabels.overrideJustification}
          content={
            <SimpleString multiline verticalScrollbar>
              {pcr.items[0].upliftJustification}
            </SimpleString>
          }
          qa="overrideJustification"
        />
      </SummaryList>

      <FinancialVirementsViewTable
        virementData={virementData}
        projectId={projectId}
        pcrId={pcrId}
        itemId={itemId}
        mode="details"
      />
    </PcrPage>
  );
};

export { UpliftSummary };
