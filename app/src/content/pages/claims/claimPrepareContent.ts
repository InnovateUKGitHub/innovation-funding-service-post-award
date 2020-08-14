import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { ProjectDto } from "@framework/dtos";

export class ClaimPrepareContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claim-prepare", project);
  }
  public readonly messages = new ClaimMessages(this, this.project);
  public readonly labels = new ClaimsLabels(this, this.project);
  public readonly backLink = () => this.getContent("back-link");
  public readonly saveAndReturnButton = () => this.getContent("button-save-and-return");
  public readonly saveAndContinueButton = () => this.getContent("button-save-and-continue");
}
