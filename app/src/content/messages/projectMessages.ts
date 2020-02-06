import { ContentBase } from "../contentBase";

export class ProjectMessages extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "project-messages");
  }

  public claimDue = () => this.getContent("claimDueMessage");
  public claimOverdue = () => this.getContent("claimOverdueMessage");
  public claimQueried = () => this.getContent("claimQueriedMessage");
  public claimRequiresIAR = () => this.getContent("claimRequiresIARMessage");
  public claimSubmitted = () => this.getContent("claimSubmittedMessage");
  public claimsToReview = (numberOfClaims: number) => this.getContent("claimsToReviewMessage", { numberOfClaims });
  public claimToSubmit = () => this.getContent("claimToSubmitMessage");
  public iarRequired = () => this.getContent("iarRequiredMessage");
  public noClaimDue = () => this.getContent("noClaimDueMessage");
  public projectEnded = () => this.getContent("projectEndedMessage");
  public finalClaimPeriod = () => this.getContent("finalClaimPeriodMessage");
  public currentPeriodInfo = (currentPeriod: number, totalPeriods: number) => this.getContent("currentPeriodInfo", { currentPeriod, totalPeriods });
  public pcrQueried = () => this.getContent("pcrQueried");
  public pcrsToReview = (numberOfPcrs: number) => this.getContent("pcrToReview", { numberOfPcrs });
  public projectOnHold = () => this.getContent("projectOnHold");
}
