import { PCRStepId } from "@framework/constants/pcrConstants";
import { PCRItemForTimeExtensionDto } from "@framework/dtos/pcrDtos";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ShortDateRangeFromDuration, Months } from "@ui/components/atomicDesign/atoms/Date";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { PcrSummaryProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { TimeExtensionStepNames } from "./timeExtensionWorkflow";

export const TimeExtensionSummary = (
  props: PcrSummaryProps<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator, TimeExtensionStepNames>,
) => {
  const newProjectDuration = (x: PCRItemForTimeExtensionDto) =>
    !!x.offsetMonths || x.offsetMonths === 0 ? x.offsetMonths + x.projectDurationSnapshot : null;

  return (
    <>
      <Section title="Existing project details">
        <SummaryList qa="existingProjectDetails">
          <SummaryListItem
            label="Start and end date"
            content={
              <ShortDateRangeFromDuration
                startDate={props.project.startDate}
                months={props.pcrItem.projectDurationSnapshot}
              />
            }
            qa="currentStartToEndDate"
          />
          <SummaryListItem
            label="Duration"
            content={<Months months={props.pcrItem.projectDurationSnapshot} />}
            qa="currentDuration"
          />
        </SummaryList>
      </Section>
      <Section title="Proposed project details">
        <SummaryList qa="proposedProjectDetails">
          <SummaryListItem
            label="Start and end date"
            content={
              <ShortDateRangeFromDuration
                startDate={props.project.startDate}
                months={newProjectDuration(props.pcrItem)}
              />
            }
            qa="newStartToEndDate"
            action={props.getEditLink(PCRStepId.timeExtension, props.validator.offsetMonthsResult)}
          />
          <SummaryListItem
            label="Duration"
            content={<Months months={newProjectDuration(props.pcrItem)} />}
            qa="newDuration"
          />
        </SummaryList>
      </Section>
    </>
  );
};