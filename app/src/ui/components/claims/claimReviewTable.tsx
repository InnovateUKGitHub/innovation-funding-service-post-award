import React from "react";
import { TypedTable } from "../table";
import { ClaimProps, createTableData, renderCostCategory} from "./utils/costCategoryTableHelper";

export function ClaimReviewTable(props: ClaimProps) {

  const combinedData = createTableData(props);
  const CostCategoriesTable = TypedTable<typeof combinedData[0]>();

  const diff = (x: typeof combinedData[0]) => x.cost.forecastThisPeriod - x.cost.costsClaimedThisPeriod;
  const diffPercentage = (x: typeof combinedData[0]) => 100 * diff(x) / x.cost.forecastThisPeriod;

  return (
    <CostCategoriesTable.Table qa="cost-cat" data={combinedData} validationResult={props.validation}>
      <CostCategoriesTable.Custom
        header="Category"
        qa="category"
        cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
        value={(x, i) => (x.isTotal ? x.category.name: renderCostCategory(props, x.category, i.row))}
      />
      <CostCategoriesTable.Currency header="Forecast for period" qa="forecastForPeriod" value={x => x.cost.forecastThisPeriod}/>
      <CostCategoriesTable.Currency
        header="Costs claimed this period"
        qa="costsThisPeriod"
        value={x => x.cost.costsClaimedThisPeriod}
        cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
      />
      <CostCategoriesTable.Currency header="Difference (£)" qa="differencePounds" value={x => diff(x)}/>
      <CostCategoriesTable.Percentage header="Difference (%)" qa="differencePercentage" value={x => diffPercentage(x)}/>
    </CostCategoriesTable.Table>
  );
}
