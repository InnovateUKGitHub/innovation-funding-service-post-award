import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ProjectMessages } from "../../messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";
import { ProjectDto } from "@framework/dtos";

export class ProjectOverviewContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "project-overview", project);
  }

  public readonly links = {
    claims: () => this.getContent("claimsLink"),
    monitoringReport: () => this.getContent("monitoringReportLink"),
    forecast: () => this.getContent("forecastLink"),
    forecasts: () => this.getContent("forecastsLink"),
    projectChangeRequests: () => this.getContent("projectChangeRequestsLink"),
    documents: () => this.getContent("documentsLink"),
    details: () => this.getContent("detailsLink"),
    summary: () => this.getContent("summaryLink"),
  };

  public readonly messages = new ProjectMessages(this, this.project);
  public readonly labels = new ProjectLabels(this, this.project);

}
