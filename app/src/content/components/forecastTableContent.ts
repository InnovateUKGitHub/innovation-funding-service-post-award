import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class ForecastTableContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "forecastTable", project);
  }

  public readonly costsClaimedHeader = this.getContent("components.forecastTable.costsClaimedHeader");
  public readonly costsClaimingHeader = this.getContent("components.forecastTable.costsClaimingHeader");
  public readonly forecastHeader = this.getContent("components.forecastTable.forecastHeader");
  public readonly totalHeader = this.getContent("components.forecastTable.totalHeader");
  public readonly totalEligibleCostsHeader = this.getContent("components.forecastTable.totalEligibleCostsHeader");
  public readonly differenceHeader = this.getContent("components.forecastTable.differenceHeader");
  public readonly periodHeader = this.getContent("components.forecastTable.periodHeader");
  public readonly noDataText = this.getContent("components.forecastTable.noDataText");
  public readonly costCategoriesHeader = this.getContent("components.forecastTable.costCategoriesHeader");

}
