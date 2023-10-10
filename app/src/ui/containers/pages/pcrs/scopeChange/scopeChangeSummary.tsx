import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useScopeChangeWorkflowQuery } from "./scopeChange.logic";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pcrScopeChangeSchema, errorMap, PcrScopeChangeSchemaType } from "./scopeChange.zod";
import { useRhfErrors } from "@framework/util/errorHelpers";

export const ScopeChangeSummary = ({
  getEditLink,
  displayCompleteForm,
  allowSubmit,
}: {
  getEditLink: (pcrStep: PCRStepType) => React.ReactElement;
  displayCompleteForm: boolean;
  allowSubmit: boolean;
}) => {
  const { projectId, itemId, fetchKey, useSetPcrValidationErrors } = usePcrWorkflowContext();

  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState } = useForm<PcrScopeChangeSchemaType>({
    defaultValues: {
      itemStatus: pcrItem.status === PCRItemStatus.Complete ? "marked-as-complete" : "",
      projectSummary: pcrItem.projectSummary ?? "",
      publicDescription: pcrItem.publicDescription ?? "",
    },
    resolver: zodResolver(pcrScopeChangeSchema, {
      errorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState?.errors);

  useSetPcrValidationErrors(validationErrors);

  return (
    <>
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
            action={getEditLink(PCRStepType.publicDescriptionStep)}
            hasError={!!validationErrors?.publicDescription}
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
            action={getEditLink(PCRStepType.projectSummaryStep)}
            hasError={!!validationErrors?.projectSummary}
          />
        </SummaryList>
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<PcrScopeChangeSchemaType>
          register={register}
          allowSubmit={allowSubmit}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        />
      )}
    </>
  );
};
