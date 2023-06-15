import * as ACC from "@ui/components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForProjectSuspensionDto } from "@framework/dtos";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators";

import { SuspendProjectSteps } from "./workflow";
import { PCRStepId } from "@framework/types";

export const SuspendProjectSummary = (
  props: PcrSummaryProps<PCRItemForProjectSuspensionDto, PCRProjectSuspensionItemDtoValidator, SuspendProjectSteps>,
) => {
  const lastDayContent = props.pcrItem.suspensionEndDate ? (
    <ACC.Renderers.ShortDate value={props.pcrItem.suspensionEndDate} />
  ) : (
    "Not set"
  );

  return (
    <ACC.Section>
      <ACC.SummaryList qa="projectSuspension">
        <ACC.SummaryListItem
          qa="startDate"
          label={x => x.pages.pcrSuspendProjectDetails.firstDayOfPauseTitle}
          validation={props.validator.suspensionStartDate}
          content={<ACC.Renderers.ShortDate value={props.pcrItem.suspensionStartDate} />}
          action={props.getEditLink(PCRStepId.details, props.validator.suspensionStartDate)}
        />

        <ACC.SummaryListItem
          qa="endDate"
          label={x => x.pages.pcrSuspendProjectDetails.lastDayOfPauseTitle}
          validation={props.validator.suspensionEndDate}
          content={lastDayContent}
          action={props.getEditLink(PCRStepId.details, props.validator.suspensionEndDate)}
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
