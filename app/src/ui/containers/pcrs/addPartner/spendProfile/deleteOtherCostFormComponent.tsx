import * as ACC from "@ui/components";
import { PCRSpendProfileOtherCostsDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteOtherCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileOtherCostsDto>) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section title={x => x.pcrSpendProfileDeleteCostContent.costSectionTitle(costCategory.name)}>
      <ACC.ValidationMessage messageType="alert" message={x => x.pcrSpendProfileDeleteCostContent.deleteGuidance} />
      <ACC.SummaryList qa="deleteOtherCost">
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.otherCosts.description}
          content={data.description}
          qa="description"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.otherCosts.totalCost}
          content={<ACC.Renderers.Currency value={data.value} />}
          qa="value"
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
