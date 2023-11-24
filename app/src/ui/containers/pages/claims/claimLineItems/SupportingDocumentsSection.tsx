import { ProjectDto } from "@framework/dtos/projectDto";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { DocumentView } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { useContent } from "@ui/hooks/content.hook";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimLineItemMode } from "./ClaimLineItems.logic";

interface SupportingDocumentsSectionProps {
  documents: DocumentSummaryDto[];
  project: Pick<ProjectDto, "competitionType">;
  claimDetails: Pick<ClaimDetailsDto, "comments">;
  mode: ClaimLineItemMode;
}

const SupportingDocumentsSection = ({ mode, documents, project, claimDetails }: SupportingDocumentsSectionProps) => {
  const { getContent } = useContent();
  const { isKTP } = checkProjectCompetition(project.competitionType);

  // Note: KTP projects submit evidence on the whole claim, not each cost category.
  if (isKTP) return null;

  return (
    <Section
      qa="supporting-documents-section"
      title={mode === "prepare" ? getContent(x => x.pages.claimLineItems.supportingDocumentsTitle) : undefined}
    >
      <DocumentView hideHeader={mode === "prepare"} qa="claim-line-item-documents" documents={documents} />

      {claimDetails.comments && (
        <Section title={getContent(x => x.pages.claimLineItems.additionalInfoTitle)} qa="additional-information">
          <P>{claimDetails.comments}</P>
        </Section>
      )}
    </Section>
  );
};

export { SupportingDocumentsSection };
