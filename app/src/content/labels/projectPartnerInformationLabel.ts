import { ContentBase } from "../contentBase";

export class ProjectPartnerInformationLabel extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "project-partner-information-labels");
  }

  public partnerName = () => this.getContent("partnerName");
  public partnerType = () => this.getContent("partnerType");
  public partnerPostcode = () => this.getContent("partnerPostcode");
}
