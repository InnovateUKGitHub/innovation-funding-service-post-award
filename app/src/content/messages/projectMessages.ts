import { ContentBase } from "../contentBase";

export class ProjectMessages extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "project-messages");
  }

  public readonly claimDue = () => this.getContent("claimDueMessage");
  public readonly claimOverdue = () => this.getContent("claimOverdueMessage");
  public readonly claimQueried = () => this.getContent("claimQueriedMessage");
  public readonly claimRequiresIAR = () => this.getContent("claimRequiresIARMessage");
  public readonly claimSubmitted = () => this.getContent("claimSubmittedMessage");
  public readonly claimsToReview = (numberOfClaims: number) => this.getContent("claimsToReviewMessage", { numberOfClaims });
  public readonly claimToSubmit = () => this.getContent("claimToSubmitMessage");
  public readonly iarRequired = () => this.getContent("iarRequiredMessage");
  public readonly noClaimDue = () => this.getContent("noClaimDueMessage");
  public readonly projectEnded = () => this.getContent("projectEndedMessage");
  public readonly finalClaimPeriod = () => this.getContent("finalClaimPeriodMessage");
  public readonly currentPeriodInfo = (currentPeriod: number, totalPeriods: number) => this.getContent("currentPeriodInfo", { currentPeriod, totalPeriods });
  public readonly pcrQueried = () => this.getContent("pcrQueried");
  public readonly pcrsToReview = (numberOfPcrs: number) => this.getContent("pcrToReview", { numberOfPcrs });
  public readonly projectOnHold = () => this.getContent("projectOnHold");
}
