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

  const { register, handleSubmit, formState, watch } = useForm<RenamePartnerSchemaType>({
    defaultValues: {
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
          />
          <SummaryListItem
            label={x => x.pcrNameChangeLabels.proposedName}
            content={pcrItem.accountName}
            qa="newPartnerName"
            action={<EditLink stepName={PCRStepType.partnerNameStep} />}
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

// const RenamePartnerSummaryContainer = (
//   props: PcrSummaryProps<
//     PCRItemForAccountNameChangeDto,
//     PCRAccountNameChangeItemDtoValidator,
//     PCRStepType.partnerNameStep | PCRStepType.filesStep
//   > &
//     InnerProps,
// ) => {
//   const { pcrItem, validator, documents, projectPartners, getEditLink } = props;
//   const multiplePartnerProject = projectPartners.length > 1;

//   return (
//     <Section qa="name-change-summary">
//       <SummaryList qa="name-change-summary-list">
//         <SummaryListItem
//           label={x => x.pcrNameChangeLabels.existingName}
//           content={pcrItem.partnerNameSnapshot}
//           validation={validator.partnerId}
//           qa="currentPartnerName"
//           action={multiplePartnerProject && getEditLink(PCRStepType.partnerNameStep, validator.partnerId)}
//         />
//         <SummaryListItem
//           label={x => x.pcrNameChangeLabels.proposedName}
//           content={pcrItem.accountName}
//           validation={validator.accountName}
//           qa="newPartnerName"
//           action={getEditLink(PCRStepType.partnerNameStep, validator.accountName)}
//         />
//         <SummaryListItem
//           label={x => x.pcrNameChangeLabels.certificate}
//           content={
//             documents.length > 0 ? (
//               <DocumentList documents={documents} qa="documentsList" />
//             ) : (
//               <Content value={x => x.documentMessages.noDocumentsUploaded} />
//             )
//           }
//           qa="supportingDocuments"
//           action={getEditLink(PCRStepType.filesStep, null)}
//         />
//       </SummaryList>
//     </Section>
//   );
// };

// export const RenamePartnerSummary = (
//   props: PcrSummaryProps<
//     PCRItemForAccountNameChangeDto,
//     PCRAccountNameChangeItemDtoValidator,
//     PCRStepType.partnerNameStep | PCRStepType.filesStep
//   >,
// ) => {
//   const { projectChangeRequestDocuments, partners } = useStores();

//   const documents = projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id);
//   const projectPartners = partners.getPartnersForProject(props.projectId);
//   const combined = Pending.combine({
//     documents,
//     projectPartners,
//   });
//   return <Loader pending={combined} render={pending => <RenamePartnerSummaryContainer {...props} {...pending} />} />;
// };
