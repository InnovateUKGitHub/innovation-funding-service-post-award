import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";

export class ForecastsDashboardContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "forecasts-dashboard", competitionType);
  }

  public readonly partnerHeader = this.getContent("header-partner");
  public readonly totalEligibleCostsHeader = this.getContent("header-total-eligible-costs");
  public readonly forecastsAndCostsHeader = this.getContent("header-forecasts-and-costs");
  public readonly underspendHeader = this.getContent("header-underspend");
  public readonly lastUpdateHeader = this.getContent("header-last-update");
  public readonly actionHeader = this.getContent("header-action");
  public readonly viewForecastHeader = this.getContent("view-forecast");
}
