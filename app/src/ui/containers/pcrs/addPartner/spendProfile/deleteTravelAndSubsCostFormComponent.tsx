import { PCRSpendProfileTravelAndSubsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { Section } from "@ui/components/layout/section";
import { Currency } from "@ui/components/renderers/currency";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { ValidationMessage } from "@ui/components/validationMessage";
import { SpendProfileDeleteFormProps } from "./spendProfileDeleteCost.page";

export const DeleteTravelAndSubsCostFormComponent = (
  props: SpendProfileDeleteFormProps<PCRSpendProfileTravelAndSubsCostDto>,
) => {
  const { data, costCategory } = props;
  return (
    <Section title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}>
      <ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <SummaryList qa="deleteTravelAndSubsCost">
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.travelAndSubs.description}
          content={data.description}
          qa="description"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.travelAndSubs.numberOfTimes}
          content={data.numberOfTimes}
          qa="numberOfTimes"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.travelAndSubs.costOfEach}
          content={<Currency value={data.costOfEach} />}
          qa="costOfEach"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.travelAndSubs.totalCost}
          content={<Currency value={data.value} />}
          qa="totalCost"
        />
      </SummaryList>
    </Section>
  );
};
