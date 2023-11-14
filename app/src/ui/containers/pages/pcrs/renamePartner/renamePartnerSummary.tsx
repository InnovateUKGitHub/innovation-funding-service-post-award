import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useRenamePartnerWorkflowQuery } from "./renamePartner.logic";
import { useForm } from "react-hook-form";
import { RenamePartnerSchemaType, getRenamePartnerSchema, errorMap } from "./renamePartner.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { PcrPage } from "../pcrPage";
import { EditLink } from "../pcrItemSummaryLinks";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";

export const RenamePartnerSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem, partners, documents } = useRenamePartnerWorkflowQuery(projectId, itemId, fetchKey);
  const multiplePartnerProject = partners.length > 1;

  const { register, handleSubmit, formState, watch, getFieldState } = useForm<RenamePartnerSchemaType>({
    defaultValues: {
      // summary page should take default value from saved state. it will be overridden when the checkbox is clicked
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      accountName: pcrItem.accountName ?? "",
      partnerId: pcrItem.partnerId as string,
    },
    resolver: zodResolver(getRenamePartnerSchema(partners), {
      errorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);

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
        />
      )}
    </PcrPage>
  );
};
