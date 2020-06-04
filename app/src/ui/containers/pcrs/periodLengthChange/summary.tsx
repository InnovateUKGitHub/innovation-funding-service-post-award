import React from "react";
import * as ACC from "@ui/components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { ClaimFrequency, PCRItemForPeriodLengthChangeDto } from "@framework/dtos";
import { PCRPeriodLengthChangeItemDtoValidator } from "@ui/validators";

const guidance  = `This request is to change the length of a period for the remainder of the project. The frequency of how often you submit a claim and the project forecasts will be affected as a result. This will apply to all partners.\n\nIt will be rejected if submitted with any other request type.`;

export const PeriodLengthChangeSummary = (props: PcrSummaryProps<PCRItemForPeriodLengthChangeDto, PCRPeriodLengthChangeItemDtoValidator, "">) => {
  return (
    /*TODO look at title sizing*/
    <ACC.Section title="">
      <ACC.Section qa="guidance">
        <ACC.Renderers.Markdown value={guidance} />
      </ACC.Section>
      <ACC.Section title="Current period length">
        <ACC.Renderers.SimpleString>
          {props.project.claimFrequency === ClaimFrequency.Monthly ? "1 month" : "3 months"}
        </ACC.Renderers.SimpleString>
      </ACC.Section>
      <ACC.Section title="New period length">
        <ACC.Renderers.SimpleString>
          {props.project.claimFrequency === ClaimFrequency.Monthly ? "3 months" : "1 month"}
        </ACC.Renderers.SimpleString>
      </ACC.Section>
    </ACC.Section>
  );
};
