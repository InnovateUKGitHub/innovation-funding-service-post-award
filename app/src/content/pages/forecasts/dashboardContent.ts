import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ProjectDto } from "@framework/dtos";

export class ForecastsDashboardContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "forecasts-dashboard", project);
  }

  public readonly partnerHeader = this.getContent("header-partner");
  public readonly totalEligibleCostsHeader = this.getContent("header-total-eligible-costs");
  public readonly forecastsAndCostsHeader = this.getContent("header-forecasts-and-costs");
  public readonly underspendHeader = this.getContent("header-underspend");
  public readonly lastUpdateHeader = this.getContent("header-last-update");
  public readonly actionHeader = this.getContent("header-action");
  public readonly viewForecastHeader = this.getContent("view-forecast");
}
