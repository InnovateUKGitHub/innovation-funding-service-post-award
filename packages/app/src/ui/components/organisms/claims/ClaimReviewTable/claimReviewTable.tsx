import { useContent } from "@ui/hooks/content.hook";
import { createTypedTable } from "@ui/components/molecules/Table/Table";
import { ClaimTableProps, ClaimTableRow, useCreateTableData } from "../utils/costCategoryTableHelper";
import { ClaimAgreedCostWarning } from "@ui/components/molecules/validation/AgreedCostWarning/AgreedCostWarning";

const CostCategoriesTable = createTypedTable<ClaimTableRow>();

export const ClaimReviewTable = (props: ClaimTableProps) => {
  const { getContent } = useContent();
  const { costCategories, totalNegativeCategories } = useCreateTableData(props);

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
        caption={props.caption}
      >
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
    </>
  );
};
