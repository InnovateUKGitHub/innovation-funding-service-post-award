import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { ProjectLabels } from "@content/labels/projectLabels";
import { ProjectMessages } from "../../messages/projectMessages";

export class ProjectOverviewContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "project-overview", competitionType);
  }

  public readonly links = {
    loans: this.getContent("loansLink"),
    claims: this.getContent("claimsLink"),
    monitoringReport: this.getContent("monitoringReportLink"),
    forecast: this.getContent("forecastLink"),
    forecasts: this.getContent("forecastsLink"),
    projectChangeRequests: this.getContent("projectChangeRequestsLink"),
    documents: this.getContent("documentsLink"),
    details: this.getContent("detailsLink"),
    summary: this.getContent("summaryLink"),
  };

  public readonly messages = new ProjectMessages(this, this.competitionType);
  public readonly labels = new ProjectLabels(this, this.competitionType);

  public readonly backToProjects = this.getContent("backToProjects");
  public readonly costsToDateMessage = this.getContent("costsToDateMessage");
}
