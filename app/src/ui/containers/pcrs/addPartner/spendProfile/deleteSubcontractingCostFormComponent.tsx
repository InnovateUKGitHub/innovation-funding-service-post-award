import React from "react";
import * as ACC from "@ui/components";
import { PCRSpendProfileSubcontractingCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { SpendProfileDeleteFormProps } from "@ui/containers";

export const DeleteSubcontractingCostFormComponent = (props: SpendProfileDeleteFormProps<PCRSpendProfileSubcontractingCostDto>) => {
  const { data, costCategory } = props;
  return (
    <ACC.Section titleContent={x => x.pcrSpendProfileDeleteCostContent.costSectionTitle(costCategory.name)}>
      <ACC.ValidationMessage messageType="alert" messageContent={x => x.pcrSpendProfileDeleteCostContent.deleteGuidance()} />
      <ACC.SummaryList qa="deleteSubcontractingCost">
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.subcontracting.subcontractorName()} content={data.description} qa="description" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.subcontracting.subcontractorCountry()} content={data.subcontractorCountry} qa="subcontractorCountry" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.subcontracting.subcontractorRoleAndDescription()} content={data.subcontractorRoleAndDescription} qa="subcontractorRoleAndDescription" />
        <ACC.SummaryListItem labelContent={x => x.pcrSpendProfileDeleteCostContent.labels.subcontracting.cost()} content={<ACC.Renderers.Currency value={data.value} />} qa="value" />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
