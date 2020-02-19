import { ContentBase } from "../contentBase";

export class ProjectContactLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "project-contact-labels");
  }

  public readonly contactName = () => this.getContent("contactName");
  public readonly partnerName = () => this.getContent("partnerName");
  public readonly partnerType = () => this.getContent("partnerType");
  public readonly contactEmail = () => this.getContent("contactEmail");
  public readonly partnerPostcode = () => this.getContent("partnerPostcode");
}
