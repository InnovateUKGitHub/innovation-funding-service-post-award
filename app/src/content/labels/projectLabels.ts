import { ContentBase } from "../contentBase";

export class ProjectLabels extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "project-labels", competitionType);
  }

  public readonly projectCosts = this.getContent("projectCostsLabel");
  public readonly partnerCosts = (partnerName: string) => this.getContent("partnerCostsLabel", { partnerName });
  public readonly partner = this.getContent("partner");
  public readonly totalEligibleCosts = this.getContent("totalEligibleCostsLabel");
  public readonly totalEligibleCostsClaimed = this.getContent("totalEligibleCostsClaimedLabel");
  public readonly percentageEligibleCostsClaimed = this.getContent("percentageEligibleCostsClaimedLabel");
  public readonly projectMembers = this.getContent("projectMembers");
  public readonly financeContacts = this.getContent("financeContacts");
  public readonly otherContacts = this.getContent("otherContacts");
  public readonly projectInformation = this.getContent("projectInformation");
  public readonly startDate = this.getContent("startDate");
  public readonly endDate = this.getContent("endDate");
  public readonly duration = this.getContent("duration");
  public readonly numberOfPeriods = this.getContent("numberOfPeriods");
  public readonly scope = this.getContent("scope");
  public readonly partners = this.getContent("partners");
  public readonly awardRate = this.getContent("awardRate");
  public readonly totalGrant = this.getContent("totalGrant");
  public readonly totalPrepayment = this.getContent("totalPrepayment");
  public readonly capLimit = this.getContent("capLimit");
  public readonly auditReportFrequency = this.getContent("auditReportFrequency");
  public readonly remainingGrant = this.getContent("remainingGrant");
}
