import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class ClaimReviewContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claim-review", project);
  }
  public readonly messages = new ClaimMessages(this, this.project);
  public readonly documentMessages = new DocumentMessages(this, this.project);
  public readonly labels = new ClaimsLabels(this, this.project);
  public readonly backLink = () => this.getContent("back-link");
  public readonly queryClaimOption = () => this.getContent("option-query-claim");
  public readonly approveClaimOption = () => this.getContent("option-submit-claim");
  public readonly howToProceedSectionTitle = () => this.getContent("section-title-how-to-proceed");
  public readonly additionalInfoSectionTitle = () => this.getContent("section-title-additional-info");
  public readonly additionalInfoHint = () => this.getContent("additional-info-hint");
  public readonly monitoringReportReminder = () => this.getContent("monitoring-report-reminder");
  public readonly submitButton = () => this.getContent("button-submit");
  public readonly sendQueryButton = () => this.getContent("button-send-query");
  public readonly uploadButton = () => this.getContent("button-upload");
  public readonly uploadInputLabel = () => this.getContent("label-input-upload");
  public readonly uploadClaimValidationFormAccordionTitle = () => this.getContent("accordion-title-upload-claim-validation-form");
}
