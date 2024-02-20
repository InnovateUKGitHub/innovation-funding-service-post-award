import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useScopeChangeWorkflowQuery } from "./scopeChange.logic";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pcrScopeChangeSchema, scopeChangeErrorMap, PcrScopeChangeSchemaType } from "./scopeChange.zod";
import { EditLink } from "../pcrItemSummaryLinks";
import { PcrPage } from "../pcrPage";
import { useRhfErrors } from "@framework/util/errorHelpers";

export const ScopeChangeSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState, watch } = useForm<PcrScopeChangeSchemaType>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      projectSummary: pcrItem.projectSummary ?? "",
      publicDescription: pcrItem.publicDescription ?? "",
    },
    resolver: zodResolver(pcrScopeChangeSchema, {
      errorMap: scopeChangeErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);

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
        <PcrItemSummaryForm<PcrScopeChangeSchemaType>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        />
      )}
    </PcrPage>
  );
};
