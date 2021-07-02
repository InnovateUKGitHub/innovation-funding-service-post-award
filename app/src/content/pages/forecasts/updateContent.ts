import { ForecastsLabels } from "@content/labels/forecastsLabels";
import { ForecastsMessages } from "@content/messages/forecastsMessages";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ForecastsUpdateContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "forecasts-update", competitionType);
  }

  public readonly labels = new ForecastsLabels(this, this.competitionType);
  public readonly messages = new ForecastsMessages(this, this.competitionType);

  public readonly backLink = this.getContent("back-link");
  public readonly submitButton = this.getContent("button-submit");
}
