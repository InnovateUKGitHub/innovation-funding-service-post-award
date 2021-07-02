import { ClaimMessages } from "@content/messages/claimMessages";
import { DocumentMessages } from "@content/messages/documentMessages";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ClaimDetailDocumentsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claim-detail-documents", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
}
