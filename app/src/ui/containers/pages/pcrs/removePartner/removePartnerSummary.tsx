import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useRemovePartnerWorkflowQuery } from "./removePartner.logic";
import { useForm } from "react-hook-form";
import { RemovePartnerSchemaType, getRemovePartnerSchema, errorMap } from "./removePartner.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { PcrPage } from "../pcrPage";
import { EditLink } from "../pcrItemSummaryLinks";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";

export const RemovePartnerSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem, documents, project } = useRemovePartnerWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState, watch } = useForm<RemovePartnerSchemaType>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      removalPeriod: pcrItem.removalPeriod,
      partnerId: pcrItem.partnerId,
    },
    resolver: zodResolver(getRemovePartnerSchema(project.numberOfPeriods), {
      errorMap,
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
            hasError={!!formState?.errors?.partnerId}
          />
          <SummaryListItem
            label={x => x.pcrRemovePartnerLabels.lastPeriod}
            content={pcrItem.removalPeriod}
            qa="removalPeriod"
            action={<EditLink stepName={PCRStepType.removalPeriodStep} />}
            hasError={!!formState?.errors?.removalPeriod}
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
