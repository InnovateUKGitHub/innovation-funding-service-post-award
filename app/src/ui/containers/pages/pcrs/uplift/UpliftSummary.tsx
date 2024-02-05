import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useUpliftSummaryQuery } from "./UpliftSummary.logic";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { useContent } from "@ui/hooks/content.hook";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { PcrPage } from "../pcrPage";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { FinancialVirementsViewTable } from "../financialVirements/summary/FinancialVirementsViewTable";
import { useMapFinancialVirements } from "../utils/useMapFinancialVirements";

const UpliftSummary = () => {
  const { projectId, pcrId, itemId, mode } = usePcrWorkflowContext();
  if (mode === "prepare") throw new Error("This page does not support the prepare mode");

  const { pcr, documents, financialVirementsForCosts, financialVirementsForParticipants, partners } =
    useUpliftSummaryQuery({ projectId, pcrId, pcrItemId: itemId });
  const { getContent } = useContent();

  const { virementData } = useMapFinancialVirements({
    financialVirementsForCosts,
    financialVirementsForParticipants,
    partners,
  });

  return (
    <PcrPage validationErrors={undefined}>
      <SummaryList qa="pcr_reasoning">
        <SummaryListItem label={x => x.pcrLabels.requestNumber} content={pcr.requestNumber} qa="numberRow" />
        <SummaryListItem
          label={x => x.pcrLabels.type({ count: pcr.items.length })}
          content={getContent(x => x.pcrTypes.uplift)}
          qa="typesRow"
        />
        <SummaryListItem
          label={x => x.pcrReasoningLabels.comments}
          content={
            <SimpleString multiline verticalScrollbar>
              {pcr.items[0].reasoningComments}
            </SimpleString>
          }
          qa="comments"
        />
        <SummaryListItem
          label={x => x.pcrReasoningLabels.files}
          content={
            documents.length ? (
              <DocumentList documents={documents} qa="docs" />
            ) : (
              getContent(x => x.pages.pcrReasoningSummary.noDocuments)
            )
          }
          qa="files"
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
