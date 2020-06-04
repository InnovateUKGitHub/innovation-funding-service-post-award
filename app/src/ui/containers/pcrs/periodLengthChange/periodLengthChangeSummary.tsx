import React from "react";
import * as ACC from "@ui/components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { ClaimFrequency, PCRItemForPeriodLengthChangeDto } from "@framework/dtos";
import { PCRPeriodLengthChangeItemDtoValidator } from "@ui/validators";

export const PeriodLengthChangeSummary = (props: PcrSummaryProps<PCRItemForPeriodLengthChangeDto, PCRPeriodLengthChangeItemDtoValidator, "">) => {
  const monthlyContent = <ACC.Content value={(x) => x.pcrPeriodLengthChangeContent.periodLengthMonthly()} />;
  const quarterlyContent = <ACC.Content value={(x) => x.pcrPeriodLengthChangeContent.periodLengthQuarterly()} />;
  return (
    /*TODO look at title sizing*/
    <ACC.Section title="">
      <ACC.Section qa="guidance">
        <ACC.Content value={(x) => x.pcrPeriodLengthChangeContent.guidance()} />
      </ACC.Section>
      <ACC.Section titleContent={x => x.pcrPeriodLengthChangeContent.labels.currentPeriodLength()} qa="current-length">
        <ACC.Renderers.SimpleString>
          {props.project.claimFrequency === ClaimFrequency.Monthly ? monthlyContent : quarterlyContent}
        </ACC.Renderers.SimpleString>
      </ACC.Section>
      <ACC.Section titleContent={x => x.pcrPeriodLengthChangeContent.labels.previousPeriodLength()} qa="previous-length">
        <ACC.Renderers.SimpleString>
          {props.project.claimFrequency === ClaimFrequency.Monthly ? quarterlyContent : monthlyContent}
        </ACC.Renderers.SimpleString>
      </ACC.Section>
    </ACC.Section>
  );
};
