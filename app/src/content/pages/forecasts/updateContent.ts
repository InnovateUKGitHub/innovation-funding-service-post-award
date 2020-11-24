import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ProjectDto } from "@framework/dtos";
import { ForecastsLabels } from "@content/labels/forecastsLabels";
import { ForecastsMessages } from "@content/messages/forecastsMessages";

export class ForecastsUpdateContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "forecasts-update", project);
  }

  public readonly labels = new ForecastsLabels(this, this.project);
  public readonly messages = new ForecastsMessages(this, this.project);

  public readonly backLink = this.getContent("back-link");
  public readonly submitButton = this.getContent("button-submit");
}
