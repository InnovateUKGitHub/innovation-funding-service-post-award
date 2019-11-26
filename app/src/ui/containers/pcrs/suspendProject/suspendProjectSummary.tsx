import React from "react";
import * as ACC from "@ui/components";
import { SummaryProps } from "../workflow";
import { suspendProjectWorkflow } from "./workflow";

export const SuspendProjectSummary = (props: SummaryProps<typeof suspendProjectWorkflow>) => {
  return (
    <ACC.Section title="">
      <ACC.SummaryList qa="projectSuspension">
        <ACC.SummaryListItem label="First day of pause" validation={props.validator.suspensionStartDate} content={<ACC.Renderers.ShortDate value={props.pcrItem.suspensionStartDate} />} qa="startDate" action={props.getEditLink("details", props.validator.suspensionStartDate)} />
        <ACC.SummaryListItem label="Last day of pause (if known)" validation={props.validator.suspensionEndDate} content={props.pcrItem.suspensionEndDate ? <ACC.Renderers.ShortDate value={props.pcrItem.suspensionEndDate} /> : "Not set"} qa="endDate" action={props.getEditLink("details", props.validator.suspensionEndDate)}/>
      </ACC.SummaryList>
    </ACC.Section>
  );
};
