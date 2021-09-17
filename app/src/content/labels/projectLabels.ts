import { ContentBase } from "@content/contentBase";

export class ProjectLabels extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
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
  public readonly competitionNameLabel = this.getContent("competition-name");
  public readonly competitionTypeLabel = this.getContent("competition-type");
  public readonly startDate = this.getContent("startDate");
  public readonly endDate = this.getContent("endDate");
  public readonly duration = this.getContent("duration");
  public readonly numberOfPeriods = this.getContent("numberOfPeriods");
  public readonly scope = this.getContent("scope");
  public readonly partners = this.getContent("partners");
  public readonly awardRate = this.getContent("awardRate");
  public readonly capLimit = this.getContent("capLimit");
  public readonly auditReportFrequency = this.getContent("auditReportFrequency");

  private readonly remainingGrantValue = this.getContent("remainingGrantValue");
  private readonly remainingContractValue = this.getContent("remainingContractValue");
  public readonly remainingValue =
    this.getGrantOrContract() === "grant" ? this.remainingGrantValue : this.remainingContractValue;

  private readonly totalGrantApproved = this.getContent("totalGrantApproved");
  private readonly totalContractPaid = this.getContent("totalContractPaid");
  public readonly totalApproved = this.getGrantOrContract() === "grant" ? this.totalGrantApproved : this.totalContractPaid;

  private readonly totalGrantPrepayment = this.getContent("totalGrantPrepayment");
  private readonly totalContractPrepayment = this.getContent("totalContractPrepayment");
  public readonly totalPrepayment =
    this.getGrantOrContract() === "grant" ? this.totalGrantPrepayment : this.totalContractPrepayment;
}
