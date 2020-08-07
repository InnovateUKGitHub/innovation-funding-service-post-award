import { ContentBase } from "../contentBase";
import { ProjectDto } from "@framework/dtos";

export class ProjectContactLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "project-contact-labels", project);
  }

  public readonly contactName = () => this.getContent("contactName");
  public readonly partnerName = () => this.getContent("partnerName");
  public readonly partnerType = () => this.getContent("partnerType");
  public readonly contactEmail = () => this.getContent("contactEmail");
  public readonly partnerPostcode = () => this.getContent("partnerPostcode");
}
