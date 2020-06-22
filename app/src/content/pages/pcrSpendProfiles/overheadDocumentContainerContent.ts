import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PcrSpendProfileOverheadDocumentContent extends ContentPageBase {

  constructor(content: Content) {
    super(content, "pcr-spend-profile-overhead-documents");
  }

  public readonly labels = new DocumentLabels(this);
  public readonly messages = new DocumentMessages(this);

  public readonly guidanceHeading = () => this.getContent("guidance-heading");
  public readonly backLink = () => this.getContent("back-link");
  public readonly submitButton = () => this.getContent("button-submit");
  public readonly documentUploadGuidance = () => this.getContent("guidance-document-upload", { markdown: true });
  public readonly documentUploadHeading = () => this.getContent("document-upload-heading");
  public readonly templateHeading = () => this.getContent("heading-template");
}
