import { ContentBase } from "@content/contentBase";
import { ProjectDto } from "@framework/dtos";

export class ClaimsLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "claims-labels", project);
  }

  public readonly partner = () => this.getContent("partner");
  public readonly period = () => this.getContent("period");
  public readonly forecastCosts = () => this.getContent("forecast-costs");
  public readonly actualCosts = () => this.getContent("actual-costs");
  public readonly difference = () => this.getContent("difference");
  public readonly status = () => this.getContent("status");
  public readonly lastUpdated = () => this.getContent("last-updated-date");
  public readonly openSectionTitle = () => this.getContent("open-section-title");
  public readonly closedSectionTitle = () => this.getContent("closed-section-title");
  public readonly forecastAccordionTitle = () => this.getContent("accordion-title-forecast");
  public readonly claimLogAccordionTitle = () => this.getContent("accordion-title-claim-log");
  public readonly costsClaimed = () => this.getContent("costs-claimed");
  public readonly costsApproved = () => this.getContent("costs-approved");
  public readonly costsDeferred = () => this.getContent("costs-deferred");
  public readonly totalGrantPaid = () => this.getContent("total-grant-paid");
}
