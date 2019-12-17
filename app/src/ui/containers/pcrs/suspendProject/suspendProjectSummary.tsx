import React from "react";
import * as ACC from "@ui/components";
import { suspendProjectSteps } from "./workflow";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForProjectSuspensionDto } from "@framework/dtos";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators";

export const SuspendProjectSummary = (props: PcrSummaryProps<PCRItemForProjectSuspensionDto, PCRProjectSuspensionItemDtoValidator, suspendProjectSteps>) => {
  return (
    <ACC.Section title="">
      <ACC.SummaryList qa="projectSuspension">
        <ACC.SummaryListItem label="First day of pause" validation={props.validator.suspensionStartDate} content={<ACC.Renderers.ShortDate value={props.pcrItem.suspensionStartDate} />} qa="startDate" action={props.getEditLink("details", props.validator.suspensionStartDate)} />
        <ACC.SummaryListItem label="Last day of pause (if known)" validation={props.validator.suspensionEndDate} content={props.pcrItem.suspensionEndDate ? <ACC.Renderers.ShortDate value={props.pcrItem.suspensionEndDate} /> : "Not set"} qa="endDate" action={props.getEditLink("details", props.validator.suspensionEndDate)}/>
      </ACC.SummaryList>
    </ACC.Section>
  );
};
