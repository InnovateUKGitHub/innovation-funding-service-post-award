import { ClaimMessages } from "@content/messages/claimMessages";
import { DocumentMessages } from "@content/messages/documentMessages";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class EditClaimLineItemsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "edit-claim-line-items", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
  public readonly backLink = this.getContent("back-link");
  public readonly descriptionHeader = this.getContent("header-description");
  public readonly lastUpdatedHeader = this.getContent("header-last-updated");
  public readonly costHeader = this.getContent("header-cost");
  public readonly actionHeader = this.getContent("header-action");
  public readonly saveAndReturnButton = this.getContent("button-save-and-return");
  public readonly additionalInformationHeading = this.getContent("header-additional-information");
  public readonly supportingDocumentsHeader = this.getContent("header-supporting-documents");
  public readonly uploadAndRemoveDocumentsButton = this.getContent("button-upload-and-remove-documents");
  public readonly additionalInformationHint = this.getContent("hint-additional-information");
  public readonly sbriAdditionalInformationHint = this.getContent("sbri-hint-additional-information");
  public readonly removeButton = this.getContent("button-remove");
  public readonly noData = this.getContent("no-data");
  public readonly totalCosts = this.getContent("total-costs");
  public readonly forecastCosts = this.getContent("forecast-costs");
  public readonly difference = this.getContent("difference");
  public readonly addCost = this.getContent("add-cost");
  public readonly additionalInfo = this.getContent("additional-info");
}
