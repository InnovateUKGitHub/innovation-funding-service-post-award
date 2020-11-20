import { ContentBase } from "@content/contentBase";
import { ProjectDto } from "@framework/dtos";

export class ForecastsLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "forecasts-labels", project);
  }

  public readonly overheadCosts = this.getContent("overhead-costs");
}
