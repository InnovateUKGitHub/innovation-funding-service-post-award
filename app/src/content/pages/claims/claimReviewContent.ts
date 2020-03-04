import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class ClaimReviewContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "claim-review");
  }
  public readonly messages = new ClaimMessages(this);
  public readonly documentMessages = new DocumentMessages(this);
  public readonly labels = new ClaimsLabels(this);
  public readonly backLink = () => this.getContent("back-link");
  public readonly queryClaimOption = () => this.getContent("option-query-claim");
  public readonly approveClaimOption = () => this.getContent("option-submit-claim");
  public readonly howToProceedSectionTitle = () => this.getContent("section-title-how-to-proceed");
  public readonly additionalInfoSectionTitle = () => this.getContent("section-title-additional-info");
  public readonly additionalInfoHint = () => this.getContent("additional-info-hint");
  public readonly submitButton = () => this.getContent("button-submit");
  public readonly sendQueryButton = () => this.getContent("button-send-query");
  public readonly uploadButton = () => this.getContent("button-upload");
  public readonly uploadInputLabel = () => this.getContent("label-input-upload");
  public readonly uploadClaimValidationFormAccordionTitle = () => this.getContent("accordion-title-upload-claim-validation-form");
}
