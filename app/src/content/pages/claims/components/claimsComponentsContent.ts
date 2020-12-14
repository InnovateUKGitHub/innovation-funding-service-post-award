import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";

export class ClaimsComponentsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claims-components", project);
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
