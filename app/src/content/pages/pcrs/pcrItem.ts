import { ContentBase } from "../../contentBase";
import { ProjectDto } from "@framework/dtos";

export class PCRItem extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "pcr-item", project);
  }

  public readonly submitButton = () => this.getContent("submit-button");
  public readonly returnToSummaryButton = () => this.getContent("return-to-summary-button");
  public readonly returnToRequestButton = () => this.getContent("return-to-request-button");
}
