import * as Dtos from "@framework/dtos";
import * as ACC from "@ui/components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForTimeExtensionDto } from "@framework/dtos";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validators";
import { TimeExtensionStepNames } from "./timeExtensionWorkflow";
import { PCRStepId } from "@framework/types";

export const TimeExtensionSummary = (
  props: PcrSummaryProps<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator, TimeExtensionStepNames>,
) => {
  const newProjectDuration = (x: Dtos.PCRItemForTimeExtensionDto) =>
    !!x.offsetMonths || x.offsetMonths === 0 ? x.offsetMonths + x.projectDurationSnapshot : null;

  return (
    <>
      <ACC.Section title="Existing project details">
        <ACC.SummaryList qa="existingProjectDetails">
          <ACC.SummaryListItem
            label="Start and end date"
            content={
              <ACC.Renderers.ShortDateRangeFromDuration
                startDate={props.project.startDate}
                months={props.pcrItem.projectDurationSnapshot}
              />
            }
            qa="currentStartToEndDate"
          />
          <ACC.SummaryListItem
            label="Duration"
            content={<ACC.Renderers.Months months={props.pcrItem.projectDurationSnapshot} />}
            qa="currentDuration"
          />
        </ACC.SummaryList>
      </ACC.Section>
      <ACC.Section title="Proposed project details">
        <ACC.SummaryList qa="proposedProjectDetails">
          <ACC.SummaryListItem
            label="Start and end date"
            content={
              <ACC.Renderers.ShortDateRangeFromDuration
                startDate={props.project.startDate}
                months={newProjectDuration(props.pcrItem)}
              />
            }
            qa="newStartToEndDate"
            action={props.getEditLink(PCRStepId.timeExtension, props.validator.offsetMonthsResult)}
          />
          <ACC.SummaryListItem
            label="Duration"
            content={<ACC.Renderers.Months months={newProjectDuration(props.pcrItem)} />}
            qa="newDuration"
          />
        </ACC.SummaryList>
      </ACC.Section>
    </>
  );
};
