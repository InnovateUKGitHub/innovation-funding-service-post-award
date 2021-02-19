import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ContentBase } from "../contentBase";

export class DocumentsContent extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "documents", competitionType);
  }

  public readonly labels = new DocumentLabels(this, this.competitionType);
  public readonly messages = new DocumentMessages(this, this.competitionType);
}
