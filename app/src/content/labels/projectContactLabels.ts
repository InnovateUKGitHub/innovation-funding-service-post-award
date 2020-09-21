import { ContentBase } from "../contentBase";
import { ProjectDto } from "@framework/dtos";

export class ProjectContactLabels extends ContentBase {
  constructor(
    parent: ContentBase,
    protected project: ProjectDto | null | undefined
  ) {
    super(parent, "project-contact-labels", project);
  }

  public readonly fundingState = (isNonFunded: boolean) => {
    const contentLabel = isNonFunded ? "nonFundedLabel" : "fundedLabel";

    return this.getContent(contentLabel);
  }

  public readonly contactName = () => this.getContent("contactName");
  public readonly roleName = () => this.getContent("roleName");
  public readonly partnerName = () => this.getContent("partnerName");
  public readonly partnerType = () => this.getContent("partnerType");
  public readonly statusLabel = () => this.getContent("status");
  public readonly fundingLabel = () => this.getContent("fundingType");
  public readonly contactEmail = () => this.getContent("contactEmail");
  public readonly partnerPostcode = () => this.getContent("partnerPostcode");
  public readonly noContactsMessage = () => this.getContent("noContactsMessage");
}
