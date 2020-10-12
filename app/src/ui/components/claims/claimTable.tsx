import React from "react";
import { TypedTable } from "..";
import { ClaimProps, createTableData, renderCostCategory } from "./utils/costCategoryTableHelper";

export function ClaimTable(props: ClaimProps) {

  const combinedData = createTableData(props);
  const CostCategoriesTable = TypedTable<typeof combinedData[0]>();

  return (
    <CostCategoriesTable.Table qa="cost-cat" data={combinedData} validationResult={props.validation}>
      <CostCategoriesTable.Custom
        header="Category"
        qa="category"
        cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
        value={(x, i) => (x.isTotal ? x.category.name: renderCostCategory(props, x.category, i.row))}
      />
      <CostCategoriesTable.Currency header="Total eligible costs" qa="offerCosts" value={x => x.cost.offerTotal} />
      <CostCategoriesTable.Currency header="Eligible costs claimed to date" qa="claimedToDate" value={x => x.cost.costsClaimedToDate} />
      <CostCategoriesTable.Currency header="Costs claimed this period" qa="periodCosts" value={x => x.cost.costsClaimedThisPeriod} cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null} />
      <CostCategoriesTable.Currency header="Remaining eligible costs" qa="remainingCosts" value={x => x.cost.remainingOfferCosts} />
    </CostCategoriesTable.Table>
  );
}
