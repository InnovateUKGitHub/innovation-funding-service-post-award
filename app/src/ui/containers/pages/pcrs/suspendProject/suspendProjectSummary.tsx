import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForProjectSuspensionDto } from "@framework/dtos/pcrDtos";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ShortDate } from "@ui/components/atomicDesign/atoms/Date";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { PcrSummaryProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { SuspendProjectSteps } from "./workflow";

export const SuspendProjectSummary = (
  props: PcrSummaryProps<PCRItemForProjectSuspensionDto, PCRProjectSuspensionItemDtoValidator, SuspendProjectSteps>,
) => {
  const lastDayContent = props.pcrItem.suspensionEndDate ? (
    <ShortDate value={props.pcrItem.suspensionEndDate} />
  ) : (
    "Not set"
  );

  return (
    <Section>
      <SummaryList qa="projectSuspension">
        <SummaryListItem
          qa="startDate"
          label={x => x.pages.pcrSuspendProjectDetails.firstDayOfPauseTitle}
          validation={props.validator.suspensionStartDate}
          content={<ShortDate value={props.pcrItem.suspensionStartDate} />}
          action={props.getEditLink(PCRStepType.details, props.validator.suspensionStartDate)}
        />

        <SummaryListItem
          qa="endDate"
          label={x => x.pages.pcrSuspendProjectDetails.lastDayOfPauseTitle}
          validation={props.validator.suspensionEndDate}
          content={lastDayContent}
          action={props.getEditLink(PCRStepType.details, props.validator.suspensionEndDate)}
        />
      </SummaryList>
    </Section>
  );
};
