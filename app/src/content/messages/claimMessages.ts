import { ContentBase } from "../contentBase";
import { DateFormat, formatDate } from "@framework/util";

export class ClaimMessages extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "claims-messages");
  }

  public readonly guidanceMessage = () => this.getContent("guidance-message", {markdown: true});
  public readonly submitClaimConfirmation = () => this.getContent("submit-claim-confirmation");
  public readonly noOpenClaimsMessage = (nextClaimStartDate: Date) => this.getContent("no-open-claims", {nextClaimStartDate: formatDate(nextClaimStartDate, DateFormat.FULL_DATE) });
  public readonly noRemainingClaims = () => this.getContent("no-remaining-claims");
  public readonly noClosedClaims = () => this.getContent("no-closed-claims");
  public readonly finalClaim = () => this.getContent("final-claim");
  public readonly iarRequired = () => this.getContent("iar-required");
  public readonly claimQueried = () => this.getContent("claim-queried");
  public readonly claimApproved = () => this.getContent("claim-approved");
  public readonly finalClaimGuidance = () => this.getContent("final-claim-guidance", {markdown: true});
  public readonly uploadClaimValidationFormInstructions = () => this.getContent("upload-instruction-claim-validation-form", { markdown: true });
  public readonly interimClaimGuidanceFC = () => this.getContent("interim-claim-guidance-fc");
  public readonly interimClaimGuidanceMO = () => this.getContent("interim-claim-guidance-mo");
}
