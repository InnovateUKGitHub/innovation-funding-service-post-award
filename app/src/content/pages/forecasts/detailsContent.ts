import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ForecastsLabels } from "@content/labels/forecastsLabels";
import { ForecastsMessages } from "@content/messages/forecastsMessages";

export class ForecastsDetailsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "forecasts-details", competitionType);
  }

  public readonly labels = new ForecastsLabels(this, this.competitionType);
  public readonly messages = new ForecastsMessages(this, this.competitionType);

  public readonly moOrPmBackLink = this.getContent("back-link-mo-or-pm");
  public readonly backLink = this.getContent("back-link");
  public readonly updateForecastLink = this.getContent("link-update-forecast");
}
