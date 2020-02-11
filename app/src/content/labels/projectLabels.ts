import { ContentBase } from "../contentBase";

export class ProjectLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "project-labels");
  }

  public projectCosts = () => this.getContent("projectCostsLabel");
  public partnerCosts = (partnerName: string) => this.getContent("partnerCostsLabel", { partnerName });
  public partner = () => this.getContent("partner");
  public totalEligibleCosts = () => this.getContent("totalEligibleCostsLabel");
  public totalEligibleCostsClaimed = () => this.getContent("totalEligibleCostsClaimedLabel");
  public percentageEligibleCostsClaimed = () => this.getContent("percentageEligibleCostsClaimedLabel");
  public projectMembers = () => this.getContent("projectMembers");
  public financeContacts = () => this.getContent("financeContacts");
  public projectInformation = () => this.getContent("projectInformation");
  public startDate = () => this.getContent("startDate");
  public endDate = () => this.getContent("endDate");
  public duration = () => this.getContent("duration");
  public numberOfPeriods = () => this.getContent("numberOfPeriods");
  public scope = () => this.getContent("scope");
  public partners = () => this.getContent("partners");
  public awardRate = () => this.getContent("awardRate");
  public totalGrant = () => this.getContent("totalGrant");
  public totalPrepayment = () => this.getContent("totalPrepayment");
  public capLimit = () => this.getContent("capLimit");
  public auditReportFrequency = () => this.getContent("auditReportFrequency");

}
