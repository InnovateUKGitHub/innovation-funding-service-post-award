import { PartnerDto, PCRItemForAccountNameChangeDto } from "@framework/types";
import { useStores } from "@ui/redux";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { Pending } from "@shared/pending";
import * as ACC from "../../../components";
import { accountNameChangeStepNames } from "./accountNameChangeWorkflow";

interface InnerProps {
  documents: DocumentSummaryDto[];
  projectPartners: PartnerDto[];
}

const NameChangeSummaryContainer = (
  props: PcrSummaryProps<
    PCRItemForAccountNameChangeDto,
    PCRAccountNameChangeItemDtoValidator,
    accountNameChangeStepNames
  > &
    InnerProps,
) => {
  const { pcrItem, validator, documents, projectPartners, getEditLink } = props;
  const multiplePartnerProject = projectPartners.length > 1;
  const partnerName = projectPartners.find(x => x.id === pcrItem.partnerId)?.name;

  return (
    <ACC.Section qa="name-change-summary">
      <ACC.SummaryList qa="name-change-summary-list">
        <ACC.SummaryListItem
          label={x => x.pcrNameChangeLabels.existingName}
          content={partnerName}
          validation={validator.partnerId}
          qa="currentPartnerName"
          action={multiplePartnerProject && getEditLink("partnerNameStep", validator.partnerId)}
        />
        <ACC.SummaryListItem
          label={x => x.pcrNameChangeLabels.proposedName}
          content={pcrItem.accountName}
          validation={validator.accountName}
          qa="newPartnerName"
          action={getEditLink("partnerNameStep", validator.accountName)}
        />
        <ACC.SummaryListItem
          label={x => x.pcrNameChangeLabels.certificate}
          content={
            documents.length > 0 ? (
              <ACC.DocumentList documents={documents} qa="documentsList" />
            ) : (
              <ACC.Content value={x => x.documentMessages.noDocumentsUploaded} />
            )
          }
          qa="supportingDocuments"
          action={getEditLink("filesStep", null)}
        />
      </ACC.SummaryList>
    </ACC.Section>
  );
};

export const NameChangeSummary = (
  props: PcrSummaryProps<
    PCRItemForAccountNameChangeDto,
    PCRAccountNameChangeItemDtoValidator,
    accountNameChangeStepNames
  >,
) => {
  const { projectChangeRequestDocuments, partners } = useStores();

  const documents = projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id);
  const projectPartners = partners.getPartnersForProject(props.projectId);
  const combined = Pending.combine({
    documents,
    projectPartners,
  });
  return <ACC.Loader pending={combined} render={pending => <NameChangeSummaryContainer {...props} {...pending} />} />;
};
