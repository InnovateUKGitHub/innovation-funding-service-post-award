import { ContentBase } from "../contentBase";

export class FinancialVirementLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "financial-virement-labels");
  }

  public readonly partnerName = () => this.getContent("partner-name");
  public readonly costCategoryName = () => this.getContent("cost-category-name");

  public readonly originalFundingLevel = () => this.getContent("original-funding-level");
  public readonly newFundingLevel = () => this.getContent("new-funding-level");

  public readonly projectOriginalEligibleCosts = () => this.getContent("project-original-eligible-costs");
  public readonly projectNewEligibleCosts = () => this.getContent("project-new-eligible-costs");
  public readonly projectDifferenceCosts = () => this.getContent("project-difference-costs");
  public readonly projectOriginalGrant = () => this.getContent("project-original-grant");
  public readonly projectNewGrant = () => this.getContent("project-new-grant");
  public readonly projectDifferenceGrant = () => this.getContent("project-difference-grant");

  public readonly partnerOriginalEligibleCosts = () => this.getContent("partner-original-eligible-costs");
  public readonly partnerOriginalRemainingCosts = () => this.getContent("partner-original-remaining-costs");
  public readonly partnerOriginalGrant = () => this.getContent("partner-original-grant");
  public readonly partnerOriginalRemainingGrant = () => this.getContent("partner-original-remaining-grant");
  public readonly partnerNewEligibleCosts = () => this.getContent("partner-new-eligible-costs");
  public readonly partnerNewRemainingCosts = () => this.getContent("partner-new-remaining-costs");
  public readonly partnerNewGrant = () => this.getContent("partner-new-grant");
  public readonly partnerNewRemainingGrant = () => this.getContent("partner-new-remaining-grant");
  public readonly partnerDifferenceCosts = () => this.getContent("partner-difference-costs");
  public readonly partnerDifferenceGrant = () => this.getContent("partner-difference-grant");

  public readonly costCategoryCostsClaimed = () => this.getContent("cost-category-costs-claimed");
  public readonly costCategoryOriginalEligibleCosts = () => this.getContent("cost-category-original-eligible-costs");
  public readonly costCategoryNewEligibleCosts = () => this.getContent("cost-category-new-eligible-costs");
  public readonly costCategoryDifferenceCosts = () => this.getContent("cost-category-difference-costs");

  public readonly projectTotals = () => this.getContent("project-totals");
  public readonly partnerTotals = () => this.getContent("partner-totals");

  public readonly grantMovingOverYear = () => this.getContent("grant-moving-over-year");
  public readonly yearEndInformation = () => this.getContent("year-end-information");
}
