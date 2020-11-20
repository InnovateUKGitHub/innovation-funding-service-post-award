import React from "react";
import * as ACC from "@ui/components";
import { PCRSpendProfileMaterialsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteMaterialsCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileMaterialsCostDto>) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section titleContent={x => x.pcrSpendProfileDeleteCostContent.costSectionTitle(costCategory.name)}>
      <ACC.ValidationMessage messageType="alert" message={x => x.pcrSpendProfileDeleteCostContent.deleteGuidance()} />
      <ACC.SummaryList qa="deleteMaterialsCost">
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.materials.item} content={data.description} qa="item" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.materials.quantity} content={data.quantity} qa="quantity" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.materials.costPerItem} content={<ACC.Renderers.Currency value={data.costPerItem} />} qa="costPerItem" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.materials.totalCost} content={<ACC.Renderers.Currency value={data.value} />} qa="totalCost" />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
