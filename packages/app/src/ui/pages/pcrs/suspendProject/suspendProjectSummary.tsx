import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Section } from "@ui/components/molecules/Section/section";
import { ShortDate } from "@ui/components/atoms/Date";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useOnUpdateSuspendProjectSummary, usePcrSuspendProjectWorkflowQuery } from "./suspendProject.logic";
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
import { useContent } from "@ui/hooks/content.hook";

export const SuspendProjectSummary = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();
  const { pcrItem } = usePcrSuspendProjectWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState, watch, setError } = useForm<ProjectSuspensionSummarySchemaType>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      suspensionStartDate: pcrItem.suspensionStartDate,
      suspensionEndDate: pcrItem.suspensionEndDate,
      form: FormTypes.PcrProjectSuspensionSummary,
    },
    resolver: zodResolver(pcrProjectSuspensionSummarySchema, {
      errorMap: pcrProjectSuspensionErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);

  const { onUpdate, isFetching } = useOnUpdateSuspendProjectSummary();

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <SummaryList qa="projectSuspension">
          <SummaryListItem
            qa="startDate"
            id="suspensionStartDate"
            label={x => x.pages.pcrSuspendProjectDetails.firstDayOfPauseTitle}
            content={
              pcrItem.suspensionStartDate ? (
                <ShortDate value={pcrItem.suspensionStartDate} />
              ) : (
                <EditLink stepName={PCRStepType.details}>
                  {getContent(x => x.pages.pcrSuspendProjectDetails.firstDayUnset)}
                </EditLink>
              )
            }
            action={pcrItem.suspensionStartDate && <EditLink stepName={PCRStepType.details} />}
            hasError={!!formState?.errors?.suspensionStartDate}
          />

          <SummaryListItem
            qa="endDate"
            id="suspensionEndDate"
            label={x => x.pages.pcrSuspendProjectDetails.lastDayOfPauseTitle}
            content={
              pcrItem.suspensionEndDate ? (
                <ShortDate value={pcrItem.suspensionEndDate} />
              ) : (
                getContent(x => x.pages.pcrSuspendProjectDetails.lastDayUnset)
              )
            }
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
          onUpdate={onUpdate}
          isFetching={isFetching}
        >
          <input type="hidden" name="suspensionStartDate" value={pcrItem.suspensionStartDate?.toISOString()} />
          <input type="hidden" name="form" value={FormTypes.PcrProjectSuspensionSummary} />
        </PcrItemSummaryForm>
      )}
    </PcrPage>
  );
};
