import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ShortDate } from "@ui/components/atomicDesign/atoms/Date";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { usePcrSuspendProjectWorkflowQuery } from "./suspendProject.logic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pcrProjectSuspensionSummarySchema, errorMap, ProjectSuspensionSummarySchemaType } from "./suspendProject.zod";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { EditLink } from "../pcrItemSummaryLinks";
import { PcrPage } from "../pcrPage";
import { useRhfErrors } from "@framework/util/errorHelpers";

export const SuspendProjectSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem } = usePcrSuspendProjectWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState, watch } = useForm<ProjectSuspensionSummarySchemaType>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      suspensionStartDate: pcrItem.suspensionStartDate,
    },
    resolver: zodResolver(pcrProjectSuspensionSummarySchema, {
      errorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);

  const lastDayContent = pcrItem.suspensionEndDate ? <ShortDate value={pcrItem.suspensionEndDate} /> : "Not set";

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <SummaryList qa="projectSuspension">
          <SummaryListItem
            qa="startDate"
            id="suspensionStartDate"
            label={x => x.pages.pcrSuspendProjectDetails.firstDayOfPauseTitle}
            content={<ShortDate value={pcrItem.suspensionStartDate} />}
            action={<EditLink stepName={PCRStepType.details} />}
            hasError={!!formState?.errors?.suspensionStartDate}
          />

          <SummaryListItem
            qa="endDate"
            id="suspensionEndDate"
            label={x => x.pages.pcrSuspendProjectDetails.lastDayOfPauseTitle}
            content={lastDayContent}
            action={<EditLink stepName={PCRStepType.details} />}
          />
        </SummaryList>
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<ProjectSuspensionSummarySchemaType>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        />
      )}
    </PcrPage>
  );
};
