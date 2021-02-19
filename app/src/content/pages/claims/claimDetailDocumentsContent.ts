import { ClaimMessages } from "@content/messages/claimMessages";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";

export class ClaimDetailDocumentsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "claim-detail-documents", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
}
