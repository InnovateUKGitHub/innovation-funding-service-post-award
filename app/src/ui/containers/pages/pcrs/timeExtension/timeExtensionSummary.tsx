import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForTimeExtensionDto } from "@framework/dtos/pcrDtos";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ShortDateRangeFromDuration, Months } from "@ui/components/atomicDesign/atoms/Date";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";

import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { usePcrTimeExtensionWorkflowQuery } from "./timeExtension.logic";

export const TimeExtensionSummary = (props: { getEditLink: (pcrStep: PCRStepType) => React.ReactElement }) => {
  const { projectId, itemId, fetchKey } = usePcrWorkflowContext();

  const { project, pcrItem } = usePcrTimeExtensionWorkflowQuery(projectId, itemId, fetchKey);

  const newProjectDuration = (x: Pick<PCRItemForTimeExtensionDto, "offsetMonths" | "projectDurationSnapshot">) =>
    !!x.offsetMonths || x.offsetMonths === 0 ? x.offsetMonths + x.projectDurationSnapshot : null;

  return (
    <>
      <Section title="Existing project details">
        <SummaryList qa="existingProjectDetails">
          <SummaryListItem
            label="Start and end date"
            content={
              <ShortDateRangeFromDuration startDate={project.startDate} months={pcrItem.projectDurationSnapshot} />
            }
            qa="currentStartToEndDate"
          />
          <SummaryListItem
            label="Duration"
            content={<Months months={pcrItem.projectDurationSnapshot} />}
            qa="currentDuration"
          />
        </SummaryList>
      </Section>

      <Section title="Proposed project details">
        <SummaryList qa="proposedProjectDetails">
          <SummaryListItem
            label="Start and end date"
            content={<ShortDateRangeFromDuration startDate={project.startDate} months={newProjectDuration(pcrItem)} />}
            qa="newStartToEndDate"
            action={props.getEditLink(PCRStepType.timeExtension)}
          />
          <SummaryListItem
            label="Duration"
            content={<Months months={newProjectDuration(pcrItem)} />}
            qa="newDuration"
          />
        </SummaryList>
      </Section>
    </>
  );
};
