import * as ACC from "@ui/components";
import { PCRSpendProfileTravelAndSubsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteTravelAndSubsCostFormComponent = (
  props: SpendProfileDeleteFormProps<PCRSpendProfileTravelAndSubsCostDto>,
) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section title={x => x.pcrSpendProfileDeleteCostContent.costSectionTitle(costCategory.name)}>
      <ACC.ValidationMessage messageType="alert" message={x => x.pcrSpendProfileDeleteCostContent.deleteGuidance} />
      <ACC.SummaryList qa="deleteTravelAndSubsCost">
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.travelAndSubs.description}
          content={data.description}
          qa="description"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.travelAndSubs.numberOfTimes}
          content={data.numberOfTimes}
          qa="numberOfTimes"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.travelAndSubs.costOfEach}
          content={<ACC.Renderers.Currency value={data.costOfEach} />}
          qa="costOfEach"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileDeleteCostContent.labels.travelAndSubs.totalCost}
          content={<ACC.Renderers.Currency value={data.value} />}
          qa="totalCost"
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
