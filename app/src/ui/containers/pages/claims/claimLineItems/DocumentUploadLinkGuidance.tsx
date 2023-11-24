import { ClaimLineItemsParams } from "./ViewClaimLineItems.page";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { ProjectDto } from "@framework/dtos/projectDto";

interface UploadDocumentsSectionProps {
  params: ClaimLineItemsParams;
  project: Pick<ProjectDto, "competitionType">;
}

const DocumentUploadLinkGuidance = ({ project }: UploadDocumentsSectionProps) => {
  const { isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);

  if (isCombinationOfSBRI) {
    return (
      <>
        <SimpleString>
          <Content value={x => x.claimsMessages.editClaimLineItemUploadEvidence} />
        </SimpleString>

        <SimpleString>
          <Content value={x => x.claimsMessages.editClaimLineItemClaimDocuments} />
        </SimpleString>

        <SimpleString>
          <Content value={x => x.claimsMessages.editClaimLineItemContactMo} />
        </SimpleString>
      </>
    );
  }

  return (
    <SimpleString>
      <Content value={x => x.claimsMessages.editClaimLineItemDocumentGuidance} />
    </SimpleString>
  );
};

export { DocumentUploadLinkGuidance };
