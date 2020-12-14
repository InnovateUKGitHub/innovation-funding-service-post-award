import React from "react";
import { TypedTable } from "../table";
import { ClaimProps, ClaimTableRow, createTableData } from "./utils/costCategoryTableHelper";
import { useContent } from "@ui/hooks";

export function ClaimReviewTable(props: ClaimProps) {
  const { getContent } = useContent();

  const { costCategories } = createTableData(props);
  const CostCategoriesTable = TypedTable<ClaimTableRow>();

  return (
    <CostCategoriesTable.Table qa="cost-cat" data={costCategories} validationResult={props.validation}>
      <CostCategoriesTable.Custom
        qa="category"
        header={getContent(x => x.claimsComponents.categoryLabel)}
        value={x => x.label}
        cellClassName={x => (x.isTotal ? "govuk-!-font-weight-bold" : null)}
      />

      <CostCategoriesTable.Currency
        qa="forecastForPeriod"
        header={getContent(x => x.claimsComponents.forecastForPeriod)}
        value={x => x.cost.forecastThisPeriod}
      />

      <CostCategoriesTable.Currency
        qa="costsThisPeriod"
        header={getContent(x => x.claimsComponents.costsClaimedThisPeriod)}
        value={x => x.cost.costsClaimedThisPeriod}
        cellClassName={x => (x.isTotal ? "govuk-!-font-weight-bold" : null)}
      />

      <CostCategoriesTable.Currency
        qa="differencePounds"
        header={getContent(x => x.claimsComponents.differenceInPounds)}
        value={x => x.differenceInPounds}
      />

      <CostCategoriesTable.Percentage
        qa="differencePercentage"
        header={getContent(x => x.claimsComponents.differenceInPercent)}
        value={x => x.diffPercentage}
      />
    </CostCategoriesTable.Table>
  );
}
