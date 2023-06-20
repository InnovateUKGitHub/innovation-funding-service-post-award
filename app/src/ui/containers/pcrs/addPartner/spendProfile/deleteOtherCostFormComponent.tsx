import { PCRSpendProfileOtherCostsDto } from "@framework/dtos/pcrSpendProfileDto";
import { Section } from "@ui/components/layout/section";
import { Currency } from "@ui/components/renderers/currency";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { ValidationMessage } from "@ui/components/validationMessage";
import { SpendProfileDeleteFormProps } from "./spendProfileDeleteCost.page";

export const DeleteOtherCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileOtherCostsDto>) => {
  const { data, costCategory } = props;
  return (
    <Section title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}>
      <ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <SummaryList qa="deleteOtherCost">
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.otherCosts.description}
          content={data.description}
          qa="description"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.otherCosts.totalCost}
          content={<Currency value={data.value} />}
          qa="value"
        />
      </SummaryList>
    </Section>
  );
};
