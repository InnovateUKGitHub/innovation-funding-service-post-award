import { ProjectDto } from "@framework/dtos/projectDto";
import { Section } from "@ui/components/molecules/Section/section";
import { DocumentView } from "@ui/components/organisms/documents/DocumentView/DocumentView";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { useContent } from "@ui/hooks/content.hook";
import { ClaimLineItemMode } from "./ClaimLineItems.logic";

interface SupportingDocumentsSectionProps {
  documents: DocumentSummaryDto[];
  project: Pick<ProjectDto, "competitionType">;
  mode: ClaimLineItemMode;
}

const SupportingDocumentsSection = ({ mode, documents, project }: SupportingDocumentsSectionProps) => {
  const { getContent } = useContent();
  const { isKTP } = checkProjectCompetition(project.competitionType);

  // Note: KTP projects submit evidence on the whole claim, not each cost category.
  if (isKTP) return null;

  return (
    <Section
      qa="supporting-documents-section"
      title={mode !== "prepare" ? getContent(x => x.pages.claimLineItems.supportingDocumentsTitle) : undefined}
    >
      <DocumentView hideHeader={mode !== "prepare"} qa="claim-line-item-documents" documents={documents} />
    </Section>
  );
};

export { SupportingDocumentsSection };
