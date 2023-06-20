import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { Section } from "@ui/components/layout/section";
import { Currency } from "@ui/components/renderers/currency";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { ValidationMessage } from "@ui/components/validationMessage";
import { SpendProfileDeleteFormProps } from "./spendProfileDeleteCost.page";

export const DeleteLabourCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileLabourCostDto>) => {
  const { data, costCategory } = props;
  return (
    <Section title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}>
      <ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <SummaryList qa="deleteLabourCost">
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.role}
          content={data.description}
          qa="roleWithinProject"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.grossCost}
          content={<Currency value={data.grossCostOfRole} />}
          qa="grossCostOfRole"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.rate}
          content={<Currency value={data.ratePerDay} />}
          qa="ratePerDay"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.daysSpentOnProject}
          content={data.daysSpentOnProject}
          qa="daysSpentOnProject"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.labour.totalCost}
          content={<Currency value={data.value} />}
          qa="totalCost"
        />
      </SummaryList>
    </Section>
  );
};
