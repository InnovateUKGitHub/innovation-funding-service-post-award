import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class PcrSpendProfileOverheadDocumentContent extends ContentPageBase {

  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-spend-profile-overhead-documents", project);
  }

  public readonly labels = new DocumentLabels(this, this.project);
  public readonly messages = new DocumentMessages(this, this.project);

  public readonly guidanceHeading = this.getContent("guidance-heading");
  public readonly backLink = this.getContent("back-link");
  public readonly submitButton = this.getContent("button-submit");
  public readonly documentUploadGuidance = this.getContent("guidance-document-upload", { markdown: true });
  public readonly documentUploadHeading = this.getContent("document-upload-heading");
  public readonly templateHeading = this.getContent("heading-template");
}
