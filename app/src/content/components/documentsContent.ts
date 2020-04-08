import { ContentBase } from "../contentBase";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class DocumentsContent extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "documents");
  }

  public readonly labels = () => new DocumentLabels(this);
  public readonly messages = () => new DocumentMessages(this);
}
