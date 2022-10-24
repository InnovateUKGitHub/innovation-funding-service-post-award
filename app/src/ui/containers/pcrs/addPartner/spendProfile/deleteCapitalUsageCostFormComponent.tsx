import * as ACC from "@ui/components";
import { PCRSpendProfileCapitalUsageCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteCapitalUsageCostFormComponent = (
  props: SpendProfileDeleteFormProps<PCRSpendProfileCapitalUsageCostDto>,
) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section
      title={x => x.pages.pcrSpendProfileDeleteCost.sectionTitleCost({ costCategoryName: costCategory.name })}
    >
      <ACC.ValidationMessage messageType="alert" message={x => x.pages.pcrSpendProfileDeleteCost.guidanceDelete} />
      <ACC.SummaryList qa="deleteCapitalUsageCost">
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.description}
          content={data.description}
          qa="description"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.type}
          content={data.typeLabel}
          qa="type"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.depreciationPeriod}
          content={data.depreciationPeriod}
          qa="depreciationPeriod"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.netPresentValue}
          content={<ACC.Renderers.Currency value={data.netPresentValue} />}
          qa="netPresentValue"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.residualValue}
          content={<ACC.Renderers.Currency value={data.residualValue} />}
          qa="residualValue"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.utilisation}
          content={<ACC.Renderers.Percentage value={data.utilisation} />}
          qa="utilisation"
        />
        <ACC.SummaryListItem
          label={x => x.pcrSpendProfileLabels.capitalUsage.netCost}
          content={<ACC.Renderers.Currency value={data.value} />}
          qa="value"
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
