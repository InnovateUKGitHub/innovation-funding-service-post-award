import { PcrSummaryProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { Pending } from "@shared/pending";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { useStores } from "@ui/redux/storesProvider";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { Loader } from "@ui/components/bjss/loading";

interface InnerProps {
  documents: DocumentSummaryDto[];
  projectPartners: PartnerDto[];
}

const RenamePartnerSummaryContainer = (
  props: PcrSummaryProps<
    PCRItemForAccountNameChangeDto,
    PCRAccountNameChangeItemDtoValidator,
    PCRStepType.partnerNameStep | PCRStepType.filesStep
  > &
    InnerProps,
) => {
  const { pcrItem, validator, documents, projectPartners, getEditLink } = props;
  const multiplePartnerProject = projectPartners.length > 1;

  return (
    <Section qa="name-change-summary">
      <SummaryList qa="name-change-summary-list">
        <SummaryListItem
          label={x => x.pcrNameChangeLabels.existingName}
          content={pcrItem.partnerNameSnapshot}
          validation={validator.partnerId}
          qa="currentPartnerName"
          action={multiplePartnerProject && getEditLink(PCRStepType.partnerNameStep, validator.partnerId)}
        />
        <SummaryListItem
          label={x => x.pcrNameChangeLabels.proposedName}
          content={pcrItem.accountName}
          validation={validator.accountName}
          qa="newPartnerName"
          action={getEditLink(PCRStepType.partnerNameStep, validator.accountName)}
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
          action={getEditLink(PCRStepType.filesStep, null)}
        />
      </SummaryList>
    </Section>
  );
};

export const RenamePartnerSummary = (
  props: PcrSummaryProps<
    PCRItemForAccountNameChangeDto,
    PCRAccountNameChangeItemDtoValidator,
    PCRStepType.partnerNameStep | PCRStepType.filesStep
  >,
) => {
  const { projectChangeRequestDocuments, partners } = useStores();

  const documents = projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id);
  const projectPartners = partners.getPartnersForProject(props.projectId);
  const combined = Pending.combine({
    documents,
    projectPartners,
  });
  return <Loader pending={combined} render={pending => <RenamePartnerSummaryContainer {...props} {...pending} />} />;
};
