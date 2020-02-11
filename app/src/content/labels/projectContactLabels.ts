import { ContentBase } from "../contentBase";

export class ProjectContactLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "project-contact-labels");
  }

  public contactName = () => this.getContent("contactName");
  public partnerName = () => this.getContent("partnerName");
  public partnerType = () => this.getContent("partnerType");
  public contactEmail = () => this.getContent("contactEmail");
  public partnerPostcode = () => this.getContent("partnerPostcode");
}
