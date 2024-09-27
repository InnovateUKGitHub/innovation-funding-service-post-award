import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Section } from "@ui/components/molecules/Section/section";
import { ShortDate } from "@ui/components/atoms/Date";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { usePcrSuspendProjectWorkflowQuery } from "./suspendProject.logic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  pcrProjectSuspensionSummarySchema,
  pcrProjectSuspensionErrorMap,
  ProjectSuspensionSummarySchemaType,
} from "./suspendProject.zod";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { EditLink } from "../pcrItemSummaryLinks";
import { PcrPage } from "../pcrPage";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const SuspendProjectSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem } = usePcrSuspendProjectWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState, watch, setError } = useForm<ProjectSuspensionSummarySchemaType>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      suspensionStartDate: pcrItem.suspensionStartDate,
      form: FormTypes.PcrProjectSuspensionSummary,
    },
    resolver: zodResolver(pcrProjectSuspensionSummarySchema, {
      errorMap: pcrProjectSuspensionErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);

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
        >
          <input type="hidden" name="suspensionStartDate" value={pcrItem.suspensionStartDate?.toISOString()} />
          <input type="hidden" name="form" value={FormTypes.PcrProjectSuspensionSummary} />
        </PcrItemSummaryForm>
      )}
    </PcrPage>
  );
};
