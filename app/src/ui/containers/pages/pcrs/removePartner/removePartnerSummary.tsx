import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useRemovePartnerWorkflowQuery } from "./removePartner.logic";
import { useForm } from "react-hook-form";
import { RemovePartnerSchemaType, getRemovePartnerSchema, removePartnerErrorMap } from "./removePartner.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { PcrPage } from "../pcrPage";
import { EditLink } from "../pcrItemSummaryLinks";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";

export const RemovePartnerSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem, documents, project } = useRemovePartnerWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState, watch, getFieldState } = useForm<RemovePartnerSchemaType>({
    defaultValues: {
      // summary page should take default value from saved state. it will be overridden when the checkbox is clicked
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      removalPeriod: pcrItem.removalPeriod,
      partnerId: pcrItem.partnerId,
    },
    resolver: zodResolver(getRemovePartnerSchema(project.numberOfPeriods), {
      errorMap: removePartnerErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);

  return (
    <PcrPage validationErrors={validationErrors}>
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
        />
      )}
    </PcrPage>
  );
};
