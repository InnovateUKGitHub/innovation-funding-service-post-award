import React from "react";
import cx from "classnames";
import { useContent } from "@ui/hooks";

import { TypedTable } from "../table";
import { ValidationListMessage } from "../ValidationListMessage";

import { ClaimProps, ClaimTableRow, createTableData } from "./utils/costCategoryTableHelper";

export function ClaimTable(props: ClaimProps) {
  const { getContent } = useContent();
  const CostCategoriesTable = TypedTable<ClaimTableRow>();

  const { costCategories, totalNegativeCategories } = createTableData(props);
  const displayWarningMessage = totalNegativeCategories.length > 0;

  const hasError = (row: ClaimTableRow): boolean => row.isTotal && row.cost.remainingOfferCosts < 0;

  return (
    <>
      {displayWarningMessage && (
        <ValidationListMessage
          before={getContent(x => x.claimsComponents.negativeCategoriesMessage.before)}
          items={totalNegativeCategories.reduce<string[]>((acc, item) => [...acc, item.category.name], [])}
          after={getContent(x => x.claimsComponents.negativeCategoriesMessage.after)}
        />
      )}

      <CostCategoriesTable.Table
        qa="cost-cat"
        data={costCategories}
        validationResult={props.validation}
        bodyRowClass={x =>
          cx({
            "table__row--error": hasError(x),
          })
        }
      >
        <CostCategoriesTable.Custom
          qa="category"
          header={getContent(x => x.claimsComponents.categoryLabel)}
          value={x => x.label}
          cellClassName={x =>
            cx({
              "govuk-!-font-weight-bold": x.isTotal,
              "claim-table-cell--error": hasError(x),
            })
          }
        />

        <CostCategoriesTable.Currency
          qa="offerCosts"
          header={getContent(x => x.claimsComponents.totalEligibleCosts)}
          value={x => x.cost.offerTotal}
        />

        <CostCategoriesTable.Currency
          qa="claimedToDate"
          header={getContent(x => x.claimsComponents.eligibleCostsClaimedToDate)}
          value={x => x.cost.costsClaimedToDate}
        />

        <CostCategoriesTable.Currency
          qa="periodCosts"
          header={getContent(x => x.claimsComponents.costsClaimedThisPeriod)}
          value={x => x.cost.costsClaimedThisPeriod}
          cellClassName={x => (x.isTotal ? "govuk-!-font-weight-bold" : null)}
        />

        <CostCategoriesTable.Currency
          qa="remainingCosts"
          header={getContent(x => x.claimsComponents.remainingEligibleCosts)}
          value={x => x.cost.remainingOfferCosts}
          cellClassName={x => (hasError(x) ? "claim-table-cell--error" : null)}
        />
      </CostCategoriesTable.Table>
    </>
  );
}
