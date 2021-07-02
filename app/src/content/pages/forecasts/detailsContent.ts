import { ForecastsLabels } from "@content/labels/forecastsLabels";
import { ForecastsMessages } from "@content/messages/forecastsMessages";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ForecastsDetailsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "forecasts-details", competitionType);
  }

  public readonly labels = new ForecastsLabels(this, this.competitionType);
  public readonly messages = new ForecastsMessages(this, this.competitionType);

  public readonly moOrPmBackLink = this.getContent("back-link-mo-or-pm");
  public readonly backLink = this.getContent("back-link");
  public readonly updateForecastLink = this.getContent("link-update-forecast");
}
