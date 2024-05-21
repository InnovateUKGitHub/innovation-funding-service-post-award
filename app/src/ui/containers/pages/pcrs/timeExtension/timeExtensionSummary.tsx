import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ShortDateRangeFromDuration, Months } from "@ui/components/atomicDesign/atoms/Date";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { usePcrTimeExtensionWorkflowQuery } from "./timeExtension.logic";
import { useForm } from "react-hook-form";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimeExtensionSchemaType, errorMap, pcrTimeExtensionSchema } from "./timeExtension.zod";
import { EditLink } from "../pcrItemSummaryLinks";
import { PcrPage } from "../pcrPage";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const TimeExtensionSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { project, pcrItem } = usePcrTimeExtensionWorkflowQuery(projectId, itemId, fetchKey);

  const newProjectDuration = (x: Pick<FullPCRItemDto, "offsetMonths" | "projectDurationSnapshot">) =>
    !!x.offsetMonths || x.offsetMonths === 0 ? x.offsetMonths + x.projectDurationSnapshot : null;

  const { register, handleSubmit, formState, watch, setError } = useForm<TimeExtensionSchemaType>({
    defaultValues: {
      form: FormTypes.PcrChangeDurationSummary,
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      timeExtension: String(pcrItem.offsetMonths ?? 0),
    },
    resolver: zodResolver(pcrTimeExtensionSchema, {
      errorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState?.errors);

  return (
    <PcrPage validationErrors={validationErrors}>
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
            action={<EditLink stepName={PCRStepType.timeExtension} />}
            hasError={!!formState?.errors?.timeExtension}
          />
          <SummaryListItem
            label="Duration"
            content={<Months months={newProjectDuration(pcrItem)} />}
            qa="newDuration"
          />
        </SummaryList>
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<TimeExtensionSchemaType>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        >
          <input type="hidden" name="form" value={FormTypes.PcrChangeDurationSummary} />
          <input type="hidden" name="timeExtension" value={String(pcrItem.offsetMonths ?? 0)} />
        </PcrItemSummaryForm>
      )}
    </PcrPage>
  );
};
