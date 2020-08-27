import { ContentBase } from "../contentBase";
import { DateFormat, formatDate } from "@framework/util";
import { ProjectDto } from "@framework/dtos";

export class ForecastsMessages extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "forecasts-messages", project);
  }

  public readonly projectChangeWarning = () => this.getContent("warning-period-change");
  public readonly projectEnded = () => this.getContent("project-ended");
  public readonly finalClaim = () => this.getContent("final-claim");
}
