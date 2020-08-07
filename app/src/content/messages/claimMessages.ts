import { ContentBase } from "../contentBase";
import { DateFormat, formatDate } from "@framework/util";
import { ProjectDto } from "@framework/dtos";

export class ClaimMessages extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "claims-messages", project);
  }

  public readonly guidanceMessage = () => this.getContent("guidance-message", { markdown: true });
  public readonly submitClaimConfirmation = () => this.getContent("submit-claim-confirmation");
  public readonly noOpenClaimsMessage = (nextClaimStartDate: Date) => this.getContent("no-open-claims", { nextClaimStartDate: formatDate(nextClaimStartDate, DateFormat.FULL_DATE) });
  public readonly noRemainingClaims = () => this.getContent("no-remaining-claims");
  public readonly noClosedClaims = () => this.getContent("no-closed-claims");
  public readonly finalClaim = () => this.getContent("final-claim");
  public readonly iarRequired = () => this.getContent("iar-required");
  public readonly claimQueried = () => this.getContent("claim-queried");
  public readonly claimApproved = () => this.getContent("claim-approved");
  public readonly finalClaimGuidance = () => this.getContent("final-claim-guidance", { markdown: true });
  public readonly uploadClaimValidationFormInstructions = () => this.getContent("upload-instruction-claim-validation-form", { markdown: true });
  public readonly interimClaimGuidanceFC = () => this.getContent("interim-claim-guidance-fc");
  public readonly interimClaimGuidanceMO = () => this.getContent("interim-claim-guidance-mo");
  public readonly interimClaimReviewGuidanceMO = () => this.getContent("interim-claim-review-guidance-mo", { markdown: true });
  public readonly frequencyChangeMessage = () => this.getContent("frequency-change-message");
  public readonly lastChanceToChangeForecast = (periodId: number) => this.getContent("last-chance-to-change-forecast", { periodId });
}
