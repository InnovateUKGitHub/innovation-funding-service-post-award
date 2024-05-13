import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useRenamePartnerWorkflowQuery } from "./renamePartner.logic";
import { useForm } from "react-hook-form";
import { RenamePartnerSchemaType, getRenamePartnerSchema, renamePartnerErrorMap } from "./renamePartner.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PcrPage } from "../pcrPage";
import { EditLink } from "../pcrItemSummaryLinks";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const RenamePartnerSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm, pcrId } = usePcrWorkflowContext();

  const { pcrItem, partners, documents } = useRenamePartnerWorkflowQuery(projectId, itemId, fetchKey);
  const multiplePartnerProject = partners.length > 1;

  console.log("pcrItem", pcrItem);
  const { register, handleSubmit, formState, watch, getFieldState, setError } = useForm<RenamePartnerSchemaType>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      accountName: pcrItem.accountName ?? "",
      partnerId: pcrItem.partnerId as string,
    },
    resolver: zodResolver(getRenamePartnerSchema(partners), {
      errorMap: renamePartnerErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section qa="name-change-summary">
        <SummaryList qa="name-change-summary-list">
          <SummaryListItem
            label={x => x.pcrNameChangeLabels.existingName}
            content={pcrItem.partnerNameSnapshot}
            qa="currentPartnerName"
            action={multiplePartnerProject && <EditLink stepName={PCRStepType.partnerNameStep} />}
            hasError={!!getFieldState("partnerId")?.error}
          />
          <SummaryListItem
            label={x => x.pcrNameChangeLabels.proposedName}
            content={pcrItem.accountName}
            qa="newPartnerName"
            action={<EditLink stepName={PCRStepType.partnerNameStep} />}
            hasError={!!getFieldState("accountName")?.error}
          />
          <SummaryListItem
            label={x => x.pcrNameChangeLabels.certificate}
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
        <PcrItemSummaryForm<RenamePartnerSchemaType>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        >
          <input type="hidden" value={FormTypes.PcrRenamePartnerSummary} {...register("form")} />
          <input type="hidden" value={projectId} {...register("projectId")} />
          <input type="hidden" value={pcrId} {...register("pcrId")} />
          <input type="hidden" value={itemId} {...register("pcrItemId")} />
        </PcrItemSummaryForm>
      )}
    </PcrPage>
  );
};
