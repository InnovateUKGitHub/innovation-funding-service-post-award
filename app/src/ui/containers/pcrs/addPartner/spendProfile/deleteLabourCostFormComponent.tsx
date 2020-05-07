import React from "react";
import * as ACC from "@ui/components";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteLabourCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileLabourCostDto>) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section titleContent={x => x.pcrSpendProfileDeleteCostContent.costSectionTitle(costCategory.name)}>
      <ACC.ValidationMessage messageType="alert" messageContent={x => x.pcrSpendProfileDeleteCostContent.deleteGuidance()} />
      <ACC.SummaryList qa="deleteLabourCost">
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.labour.role()} content={data.description} qa="roleWithinProject" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.labour.grossCost()} content={<ACC.Renderers.Currency value={data.grossCostOfRole} />} qa="grossCostOfRole" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.labour.rate()} content={<ACC.Renderers.Currency value={data.ratePerDay} />} qa="ratePerDay" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.labour.daysOnProject()} content={data.daysSpentOnProject} qa="daysSpentOnProject" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.labour.totalCost()} content={<ACC.Renderers.Currency value={data.value} />} qa="totalCost" />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
