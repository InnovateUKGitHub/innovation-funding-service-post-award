import { ContentBase } from "@content/contentBase";

export class ForecastsMessages extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "forecasts-messages", competitionType);
  }

  public readonly projectChangeWarning = this.getContent("warning-period-change");
  public readonly projectEnded = this.getContent("project-ended");
  public readonly finalClaim = this.getContent("final-claim");
  public readonly forecastUpdated = this.getContent("forecast-updated");
  public readonly partnerHasWithdrawn = this.getContent("partner-has-withdrawn");
}
