import * as ACC from "@ui/components";
import { PCRSpendProfileOtherCostsDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteOtherCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileOtherCostsDto>) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section
      title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}
    >
      <ACC.ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <ACC.SummaryList qa="deleteOtherCost">
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.otherCosts.description}
          content={data.description}
          qa="description"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.otherCosts.totalCost}
          content={<ACC.Renderers.Currency value={data.value} />}
          qa="value"
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
