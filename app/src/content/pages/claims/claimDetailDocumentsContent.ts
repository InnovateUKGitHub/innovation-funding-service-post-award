import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ProjectDto } from "@framework/dtos";
import { DocumentMessages } from "@content/messages/documentMessages";

export class ClaimDetailDocumentsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claim-detail-documents", project);
  }
  public readonly messages = new ClaimMessages(this, this.project);
  public readonly backLink = (costCategoryName: string) => this.getContent("back-link", {costCategoryName});
  public readonly formTitle = this.getContent("form-title");
  public readonly subtitle = this.getContent("subtitle");
  public readonly upload = this.getContent("upload");

  public readonly addDocumentsForTitle = this.getContent("add-documents-for-title");
  public readonly addDocumentTitle = this.getContent("add-documents-title");
  public readonly documentsTitle = this.getContent("documents-title");
  public readonly claimDocumentsTitle = this.getContent("claim-documents-title");

  public readonly documentMessages = new DocumentMessages(this, this.project);
}
