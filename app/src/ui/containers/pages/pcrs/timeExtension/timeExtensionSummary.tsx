import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ShortDateRangeFromDuration, Months } from "@ui/components/atomicDesign/atoms/Date";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { usePcrTimeExtensionWorkflowQuery } from "./timeExtension.logic";
import { useForm } from "react-hook-form";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorMap, pcrTimeExtensionSchema } from "./timeExtension.zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { EditLink } from "../pcrItemSummaryLinks";

type FormValues = {
  timeExtension: string;
  itemStatus: "marked-as-complete" | "false" | "";
};

export const TimeExtensionSummary = ({
  displayCompleteForm,
  allowSubmit,
}: {
  displayCompleteForm: boolean;
  allowSubmit: boolean;
}) => {
  const { projectId, itemId, fetchKey, useSetPcrValidationErrors } = usePcrWorkflowContext();

  const { project, pcrItem } = usePcrTimeExtensionWorkflowQuery(projectId, itemId, fetchKey);

  const newProjectDuration = (x: Pick<FullPCRItemDto, "offsetMonths" | "projectDurationSnapshot">) =>
    !!x.offsetMonths || x.offsetMonths === 0 ? x.offsetMonths + x.projectDurationSnapshot : null;

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      itemStatus: pcrItem.status === PCRItemStatus.Complete ? "marked-as-complete" : "false",
      timeExtension: String(pcrItem.offsetMonths ?? 0),
    },
    resolver: zodResolver(pcrTimeExtensionSchema, {
      errorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState?.errors);

  useSetPcrValidationErrors(validationErrors);

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
            action={<EditLink stepName={PCRStepType.timeExtension} />}
          />
          <SummaryListItem
            label="Duration"
            content={<Months months={newProjectDuration(pcrItem)} />}
            qa="newDuration"
          />
        </SummaryList>
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<FormValues>
          register={register}
          allowSubmit={allowSubmit}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        />
      )}
    </>
  );
};
