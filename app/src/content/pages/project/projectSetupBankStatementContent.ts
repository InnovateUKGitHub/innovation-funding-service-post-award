import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { PartnerLabels } from "@content/labels/partnerLabels";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class ProjectSetupBankStatementContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "project-setup-bank-statement");
  }

  public readonly partnerLabels = new PartnerLabels(this);
  public readonly documentLabels = new DocumentLabels(this);
  public readonly documentMessages = new DocumentMessages(this);
  public readonly guidanceMessage = () => this.getContent("guidance-message", {markdown: true});
  public readonly submitButton = () => this.getContent("button-submit");
  public readonly returnButton = () => this.getContent("button-return");
  public readonly backLink = () => this.getContent("back-link");
  public readonly uploadDocumentSectionTitle = () => this.getContent("section-title-upload-document");
}
