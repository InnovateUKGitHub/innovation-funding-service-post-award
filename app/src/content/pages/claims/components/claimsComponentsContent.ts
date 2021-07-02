import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ClaimsComponentsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claims-components", competitionType);
  }

  public readonly negativeCategoriesMessage = {
    before: this.getContent("negativeCategoriesMessage.before"),
    after: this.getContent("negativeCategoriesMessage.after"),
  };

  public readonly categoryLabel = this.getContent("category-label");
  public readonly totalEligibleCosts = this.getContent("total-eligible-costs");
  public readonly eligibleCostsClaimedToDate = this.getContent("eligible-costs-claimed-to-date");
  public readonly costsClaimedThisPeriod = this.getContent("costs-claimed-this-period");
  public readonly remainingEligibleCosts = this.getContent("remaining-eligible-costs");
  public readonly forecastForPeriod = this.getContent("forecast-for-period");
  public readonly differenceInPounds = this.getContent("difference-in-unit", { unitValue: "£" });
  public readonly differenceInPercent = this.getContent("difference-in-unit", { unitValue: "%" });
}
