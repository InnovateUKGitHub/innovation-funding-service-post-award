import React from "react";
import * as ACC from "@ui/components";
import {
  PCRSpendProfileCapitalUsageCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteCapitalUsageCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileCapitalUsageCostDto>) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section titleContent={x => x.pcrSpendProfileDeleteCostContent.costSectionTitle(costCategory.name)}>
      <ACC.ValidationMessage messageType="alert" message={x => x.pcrSpendProfileDeleteCostContent.deleteGuidance} />
      <ACC.SummaryList qa="deleteCapitalUsageCost">
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.capitalUsage.description} content={data.description} qa="description" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.capitalUsage.type} content={data.typeLabel} qa="type" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.capitalUsage.depreciationPeriod} content={data.depreciationPeriod} qa="depreciationPeriod" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.capitalUsage.netPresentValue} content={<ACC.Renderers.Currency value={data.netPresentValue} />} qa="netPresentValue" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.capitalUsage.residualValue} content={<ACC.Renderers.Currency value={data.residualValue} />} qa="residualValue" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.capitalUsage.utilisation} content={<ACC.Renderers.Percentage value={data.utilisation} />} qa="utilisation" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.capitalUsage.netCost} content={<ACC.Renderers.Currency value={data.value} />} qa="value" />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
