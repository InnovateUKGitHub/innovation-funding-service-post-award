import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectMessages } from "../messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";

export class ProjectOverviewContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "project-overview");
  }

  public readonly links = {
    claims: () => this.getContent("claimsLink"),
    monitoringReport: () => this.getContent("monitoringReportLink"),
    forecast: () => this.getContent("forecastLink"),
    forecasts: () => this.getContent("forecastsLink"),
    initialForecasts: () => this.getContent("initialForecastsLink"),
    projectChangeRequests: () => this.getContent("projectChangeRequestsLink"),
    documents: () => this.getContent("documentsLink"),
    details: () => this.getContent("detailsLink"),
    summary: () => this.getContent("summaryLink"),
  };

  public readonly messages = new ProjectMessages(this);
  public readonly labels = new ProjectLabels(this);

}
