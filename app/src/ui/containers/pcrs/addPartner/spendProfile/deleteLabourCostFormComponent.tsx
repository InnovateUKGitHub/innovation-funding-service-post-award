import React from "react";
import * as ACC from "@ui/components";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";

interface Props {
  data: PCRSpendProfileLabourCostDto;
}

export const DeleteLabourCostFormComponent = (props: Props) => {
  const { data } = props;
  return (
    <ACC.Section title="Delete labour cost">
      <ACC.ValidationMessage messageType="alert" message="All the information will be permanently deleted." />
      <ACC.SummaryList qa="pcr_viewItem">
        <ACC.SummaryListItem label="Role within project" content={data.description} qa="roleWithinProject" />
        <ACC.SummaryListItem label="Gross employee cost" content={<ACC.Renderers.Currency value={data.grossCostOfRole} />} qa="grossCostOfRole" />
        <ACC.SummaryListItem label="Rate (£/day)" content={<ACC.Renderers.Currency value={data.ratePerDay} />} qa="ratePerDay" />
        <ACC.SummaryListItem label="Days to be spent by all staff with this role" content={data.daysSpentOnProject} qa="daysSpentOnProject" />
        <ACC.SummaryListItem label="Total cost" content={<ACC.Renderers.Currency value={data.value} />} qa="totalCost" />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
