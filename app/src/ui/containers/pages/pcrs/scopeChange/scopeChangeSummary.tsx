import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { zodResolver } from "@hookform/resolvers/zod";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { EditLink } from "../pcrItemSummaryLinks";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { PcrPage } from "../pcrPage";
import { useScopeChangeWorkflowQuery } from "./scopeChange.logic";
import { PcrScopeChangeSchemaType, pcrScopeChangeSchema, scopeChangeErrorMap } from "./scopeChange.zod";
import { FormTypes } from "@ui/zod/FormTypes";

export const ScopeChangeSummary = () => {
  const { projectId, pcrId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, setError, formState, watch } = useForm<z.output<PcrScopeChangeSchemaType>>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      projectSummary: pcrItem.projectSummary ?? "",
      publicDescription: pcrItem.publicDescription ?? "",
    },
    resolver: zodResolver(pcrScopeChangeSchema, {
      errorMap: scopeChangeErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section qa="scope-change-summary">
        <SummaryList qa="scope-change-summary-list">
          <SummaryListItem
            label={x => x.pcrScopeChangeLabels.existingDescription}
            content={<SimpleString multiline>{pcrItem.publicDescriptionSnapshot}</SimpleString>}
            qa="currentPublicDescription"
          />
          <SummaryListItem
            label={x => x.pcrScopeChangeLabels.newDescription}
            content={<SimpleString multiline>{pcrItem.publicDescription}</SimpleString>}
            qa="newPublicDescription"
            action={<EditLink stepName={PCRStepType.publicDescriptionStep} />}
            hasError={!!formState?.errors?.publicDescription}
          />
          <SummaryListItem
            label={x => x.pcrScopeChangeLabels.existingSummary}
            content={<SimpleString multiline>{pcrItem.projectSummarySnapshot}</SimpleString>}
            qa="currentProjectSummary"
          />
          <SummaryListItem
            label={x => x.pcrScopeChangeLabels.newSummary}
            content={<SimpleString multiline>{pcrItem.projectSummary}</SimpleString>}
            qa="newProjectSummary"
            action={<EditLink stepName={PCRStepType.projectSummaryStep} />}
            hasError={!!formState?.errors?.projectSummary}
          />
        </SummaryList>
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<z.output<PcrScopeChangeSchemaType>>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        >
          <input type="hidden" value={FormTypes.PcrChangeProjectScopeSummary} {...register("form")} />
          <input type="hidden" value={projectId} {...register("projectId")} />
          <input type="hidden" value={pcrId} {...register("pcrId")} />
          <input type="hidden" value={itemId} {...register("pcrItemId")} />
        </PcrItemSummaryForm>
      )}
    </PcrPage>
  );
};
