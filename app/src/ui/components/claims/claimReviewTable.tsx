import { useContent } from "@ui/hooks/content.hook";
import { createTypedTable } from "../table";
import { ClaimTableProps, ClaimTableRow, createTableData } from "./utils/costCategoryTableHelper";

const CostCategoriesTable = createTypedTable<ClaimTableRow>();

export const ClaimReviewTable = (props: ClaimTableProps) => {
  const { getContent } = useContent();

  const { costCategories } = createTableData(props);

  return (
    <CostCategoriesTable.Table qa="cost-cat" data={costCategories} validationResult={props.validation}>
      <CostCategoriesTable.Custom
        qa="category"
        header={getContent(x => x.pages.claimsComponents.categoryLabel)}
        value={x => x.label}
        cellClassName={x => (x.isTotal ? "govuk-!-font-weight-bold" : null)}
      />

      <CostCategoriesTable.Currency
        qa="forecastForPeriod"
        header={getContent(x => x.pages.claimsComponents.forecastForPeriod)}
        value={x => x.cost.forecastThisPeriod}
      />

      <CostCategoriesTable.Currency
        qa="costsThisPeriod"
        header={getContent(x => x.pages.claimsComponents.costsClaimedThisPeriod)}
        value={x => x.cost.costsClaimedThisPeriod}
        cellClassName={x => (x.isTotal ? "govuk-!-font-weight-bold" : null)}
      />

      <CostCategoriesTable.Currency
        qa="differencePounds"
        header={getContent(x => x.pages.claimsComponents.differenceInUnit({ unit: "£" }))}
        value={x => x.differenceInPounds}
      />

      <CostCategoriesTable.Percentage
        qa="differencePercentage"
        header={getContent(x => x.pages.claimsComponents.differenceInUnit({ unit: "%" }))}
        value={x => x.diffPercentage}
      />
    </CostCategoriesTable.Table>
  );
};
