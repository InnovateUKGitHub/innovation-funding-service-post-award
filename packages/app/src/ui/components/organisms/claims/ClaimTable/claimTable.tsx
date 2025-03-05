import cx from "classnames";
import { useContent } from "@ui/hooks/content.hook";
import { createTypedTable } from "@ui/components/molecules/Table/Table";
import { ClaimTableProps, ClaimTableRow, createTableData } from "../utils/costCategoryTableHelper";
import { ClaimAgreedCostWarning } from "@ui/components/molecules/validation/AgreedCostWarning/AgreedCostWarning";

const CostCategoriesTable = createTypedTable<ClaimTableRow>();

export const ClaimTable = (props: ClaimTableProps) => {
  const { getContent } = useContent();
  const { costCategories, totalNegativeCategories } = createTableData(props);

  const hasError = (row: ClaimTableRow): boolean => row.isTotal && row.cost.remainingOfferCosts < 0;

  return (
    <>
      <ClaimAgreedCostWarning
        isFc={props.isFc}
        costCategories={totalNegativeCategories.map(item => item.category.name)}
      />

      <CostCategoriesTable.Table
        qa="cost-cat"
        data={costCategories}
        validationResult={props.validation}
        bodyRowClass={x =>
          cx({
            "table__row--error": hasError(x),
          })
        }
        caption={props.caption}
      >
        <CostCategoriesTable.Custom
          qa="category"
          header={getContent(x => x.pages.claimsComponents.categoryLabel)}
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
          header={getContent(x => x.pages.claimsComponents.totalEligibleCosts)}
          value={x => x.cost.offerTotal}
        />

        <CostCategoriesTable.Currency
          qa="claimedToDate"
          header={getContent(x => x.pages.claimsComponents.eligibleCostsClaimedToDate)}
          value={x => x.cost.costsClaimedToDate}
        />

        <CostCategoriesTable.Currency
          qa="periodCosts"
          header={getContent(x => x.pages.claimsComponents.costsClaimedThisPeriod)}
          value={x => x.cost.costsClaimedThisPeriod}
          cellClassName={x => (x.isTotal ? "govuk-!-font-weight-bold" : null)}
        />

        <CostCategoriesTable.Currency
          qa="remainingCosts"
          header={getContent(x => x.pages.claimsComponents.remainingEligibleCosts)}
          value={x => x.cost.remainingOfferCosts}
          cellClassName={x => (hasError(x) ? "claim-table-cell--error" : null)}
        />
      </CostCategoriesTable.Table>
    </>
  );
};
