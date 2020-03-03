import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class ClaimDocumentsContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "claim-documents");
  }
  public readonly backLink = () => this.getContent("back-link");
  public readonly saveAndReturnButton = () => this.getContent("button-save-and-return");
  public readonly saveAndContinueToSummaryButton = () => this.getContent("button-save-and-continue-to-summary");
  public readonly saveAndContinueToForecastButton = () => this.getContent("button-save-and-continue-to-forecast");
  public readonly uploadButton = () => this.getContent("button-upload");
  public readonly uploadInput = () => this.getContent("input-button");
  public readonly uploadSectionTitle = () => this.getContent("section-title-upload");
  public readonly documentsListSectionTitle = () => this.getContent("section-title-document-list");

  public readonly messages = new ClaimMessages(this);
  public readonly documentMessages = new DocumentMessages(this);
  public readonly labels = new ClaimsLabels(this);
}
