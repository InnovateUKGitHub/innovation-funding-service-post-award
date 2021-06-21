import * as ACC from "@ui/components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForProjectSuspensionDto } from "@framework/dtos";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators";
import { useContent } from "@ui/hooks";

import { SuspendProjectSteps } from "./workflow";

export const SuspendProjectSummary = (
  props: PcrSummaryProps<PCRItemForProjectSuspensionDto, PCRProjectSuspensionItemDtoValidator, SuspendProjectSteps>,
) => {
  const { getContent } = useContent();

  const firstDayOfPauseTitle = getContent(x => x.pcrScopeChangeProjectContent.firstDayOfPauseTitle);
  const lastDayOfPauseTitle = getContent(x => x.pcrScopeChangeProjectContent.lastDayOfPauseTitle);

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
          label={firstDayOfPauseTitle}
          validation={props.validator.suspensionStartDate}
          content={<ACC.Renderers.ShortDate value={props.pcrItem.suspensionStartDate} />}
          action={props.getEditLink("details", props.validator.suspensionStartDate)}
        />

        <ACC.SummaryListItem
          qa="endDate"
          label={lastDayOfPauseTitle}
          validation={props.validator.suspensionEndDate}
          content={lastDayContent}
          action={props.getEditLink("details", props.validator.suspensionEndDate)}
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};
