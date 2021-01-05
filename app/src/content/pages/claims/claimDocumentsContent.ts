import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { DocumentsContent } from "@content/components/documentsContent";

export class ClaimDocumentsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "claim-documents", competitionType);
  }
  public readonly backLink = this.getContent("back-link");
  public readonly saveAndReturnButton = this.getContent("button-save-and-return");
  public readonly saveAndContinueToSummaryButton = this.getContent("button-save-and-continue-to-summary");
  public readonly saveAndContinueToForecastButton = this.getContent("button-save-and-continue-to-forecast");
  public readonly documentsListSectionTitle = this.getContent("section-title-document-list");
  public readonly descriptionLabel = this.getContent("description-label");

  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
  public readonly labels = new ClaimsLabels(this, this.competitionType);
  public readonly documents = new DocumentsContent(this, this.competitionType);
}
