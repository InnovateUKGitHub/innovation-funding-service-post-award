import { PCRSpendProfileCapitalUsageCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { Section } from "@ui/components/layout/section";
import { Currency } from "@ui/components/renderers/currency";
import { Percentage } from "@ui/components/renderers/percentage";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { ValidationMessage } from "@ui/components/validationMessage";
import { SpendProfileDeleteFormProps } from "./spendProfileDeleteCost.page";

export const DeleteCapitalUsageCostFormComponent = (
  props: SpendProfileDeleteFormProps<PCRSpendProfileCapitalUsageCostDto>,
) => {
  const { data, costCategory } = props;
  return (
    <Section title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}>
      <ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <SummaryList qa="deleteCapitalUsageCost">
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.description}
          content={data.description}
          qa="description"
        />
        <SummaryListItem label={x => x.pcrSpendProfileLabels.capitalUsage.type} content={data.typeLabel} qa="type" />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.depreciationPeriod}
          content={data.depreciationPeriod}
          qa="depreciationPeriod"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.netPresentValue}
          content={<Currency value={data.netPresentValue} />}
          qa="netPresentValue"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.residualValue}
          content={<Currency value={data.residualValue} />}
          qa="residualValue"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.utilisation}
          content={<Percentage value={data.utilisation} />}
          qa="utilisation"
        />
        <SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.netCost}
          content={<Currency value={data.value} />}
          qa="value"
        />
      </SummaryList>
    </Section>
  );
};
