import { ContentBase } from "../contentBase";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class ForecastDetailsContent extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "forecastDetails", project);
  }

  public readonly finalClaimMessageFC = this.getContent("components.forecastDetails.finalClaimMessageFC");
  public readonly submitLink = this.getContent("components.forecastDetails.submitLink");
  public readonly finalClaimMessageMO = this.getContent("components.forecastDetails.finalClaimMessageMO");
  public readonly finalClaimDueMessageMO = this.getContent("components.forecastDetails.finalClaimDueMessageMO");
}
