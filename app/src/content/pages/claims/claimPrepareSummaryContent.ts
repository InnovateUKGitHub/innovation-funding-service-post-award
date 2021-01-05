import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class ClaimPrepareSummaryContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "claim-prepare-summary", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
  public readonly labels = new ClaimsLabels(this, this.competitionType);

  public readonly backToDocuments = this.getContent("back_to-documents");
  public readonly backToForecast = this.getContent("back-to-forecast");
  public readonly addCommentsHeading = this.getContent("add-comments-heading");
  public readonly addCommentsHint = this.getContent("add-comments-hint");
  public readonly submitClaimMessage = this.getContent("submit-claim-message");
  public readonly saveAndReturn = this.getContent("save-and-return-message");
  public readonly costClaimedLabel = this.getContent("costs-claimed-label");
  public readonly fundingLevelLabel = this.getContent("funding-level-label");
  public readonly costsToBePaidLabel = this.getContent("costs-to-be-paid-label");
  public readonly editCostsMessage = this.getContent("edit-costs-message");
  public readonly noDocumentsUploadedMessage = this.getContent("no-documents-uploaded-message");
  public readonly claimDocumentsTitle = this.getContent("claim-documents-title");
  public readonly editClaimDocuments = this.getContent("edit-claim-documents");
  public readonly eligibleCostsLabel = this.getContent("eligible-costs-label");
  public readonly forecastLabel = this.getContent("forecast-label");
  public readonly differenceLabel = this.getContent("difference-label");
  public readonly editForecastMessage = this.getContent("edit-forecast-message");
  public readonly costsTitle = this.getContent("costs-title");
  public readonly forecastTitle = this.getContent("forecast-title");
}
