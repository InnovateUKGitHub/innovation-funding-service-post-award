import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { PartnerLabels } from "@content/labels/partnerLabels";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class ProjectSetupBankStatementContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "project-setup-bank-statement", project);
  }

  public readonly partnerLabels = new PartnerLabels(this, this.project);
  public readonly documentLabels = new DocumentLabels(this, this.project);
  public readonly documentMessages = new DocumentMessages(this, this.project);
  public readonly guidanceMessage = this.getContent("guidance-message", {markdown: true});
  public readonly submitButton = this.getContent("button-submit");
  public readonly returnButton = this.getContent("button-return");
  public readonly backLink = this.getContent("back-link");
  public readonly documentsRemovedMessage = this.getContent("document-removed-message");
}
