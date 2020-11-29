import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { DocumentsContent } from "@content/components/documentsContent";
import { ProjectDto } from "@framework/dtos";

export class ClaimDocumentsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claim-documents", project);
  }
  public readonly backLink = this.getContent("back-link");
  public readonly saveAndReturnButton = this.getContent("button-save-and-return");
  public readonly saveAndContinueToSummaryButton = this.getContent("button-save-and-continue-to-summary");
  public readonly saveAndContinueToForecastButton = this.getContent("button-save-and-continue-to-forecast");
  public readonly uploadSectionTitle = this.getContent("section-title-upload");
  public readonly documentsListSectionTitle = this.getContent("section-title-document-list");
  public readonly subtitleMessage = this.getContent("subtitle-message");
  public readonly uploadDocumentLabel = this.getContent("upload-documents-label");
  public readonly descriptionLabel = this.getContent("description-label");
  public readonly uploadMessage = this.getContent("upload-documents-message");

  public readonly messages = new ClaimMessages(this, this.project);
  public readonly documentMessages = new DocumentMessages(this, this.project);
  public readonly labels = new ClaimsLabels(this, this.project);
  public readonly documents = new DocumentsContent(this, this.project);
}
