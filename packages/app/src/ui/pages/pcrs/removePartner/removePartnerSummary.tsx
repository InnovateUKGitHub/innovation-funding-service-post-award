import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Content } from "@ui/components/molecules/Content/content";
import { DocumentList } from "@ui/components/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useOnUpdateRemovePartner, useRemovePartnerWorkflowQuery } from "./removePartner.logic";
import { useForm } from "react-hook-form";
import { RemovePartnerSchemaType, removePartnerSchema, removePartnerErrorMap } from "./removePartner.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PcrPage } from "../pcrPage";
import { EditLink } from "../pcrItemSummaryLinks";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const RemovePartnerSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem, documents, project } = useRemovePartnerWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState, watch, getFieldState, setError } = useForm<RemovePartnerSchemaType>({
    defaultValues: {
      // summary page should take default value from saved state. it will be overridden when the checkbox is clicked
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      removalPeriod: pcrItem.removalPeriod,
      partnerId: pcrItem.partnerId,
      numberOfPeriods: project.numberOfPeriods,
    },
    resolver: zodResolver(removePartnerSchema, {
      errorMap: removePartnerErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);

  const { onUpdate, isFetching, apiError } = useOnUpdateRemovePartner();

  return (
    <PcrPage validationErrors={validationErrors} apiError={apiError}>
      <Section qa="name-change-summary">
        <SummaryList qa="name-change-summary-list">
          <SummaryListItem
            label={x => x.pcrRemovePartnerLabels.removedPartner}
            content={pcrItem.partnerNameSnapshot}
            qa="partnerToRemove"
            action={<EditLink stepName={PCRStepType.removalPeriodStep} />}
            hasError={!!getFieldState("partnerId")?.error}
          />
          <SummaryListItem
            label={x => x.pcrRemovePartnerLabels.lastPeriod}
            content={pcrItem.removalPeriod}
            qa="removalPeriod"
            action={<EditLink stepName={PCRStepType.removalPeriodStep} />}
            hasError={!!getFieldState("removalPeriod")?.error}
          />
          <SummaryListItem
            label={x => x.pcrRemovePartnerLabels.documents}
            content={
              documents.length > 0 ? (
                <DocumentList documents={documents} qa="documentsList" />
              ) : (
                <Content value={x => x.documentMessages.noDocumentsUploaded} />
              )
            }
            qa="supportingDocuments"
            action={<EditLink stepName={PCRStepType.filesStep} />}
          />
        </SummaryList>
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<RemovePartnerSchemaType>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
          onUpdate={onUpdate}
          isFetching={isFetching}
        >
          <input type="hidden" {...register("form")} value={FormTypes.PcrRemovePartnerSummary} />
          <input type="hidden" name="numberOfPeriods" value={project.numberOfPeriods} />
        </PcrItemSummaryForm>
      )}
    </PcrPage>
  );
};
