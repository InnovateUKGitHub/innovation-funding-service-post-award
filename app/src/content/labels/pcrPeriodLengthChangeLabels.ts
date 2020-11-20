import { ContentBase } from "@content/contentBase";
import { ProjectDto } from "@framework/dtos";

export class PCRPeriodLengthChangeLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "pcr-period-length-change-labels", project);
  }

  public readonly currentPeriodLength = this.getContent("current-period-length");
  public readonly newPeriodLength = this.getContent("new-period-length");
}
