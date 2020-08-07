import { ContentBase } from "../contentBase";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class DocumentsContent extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "documents", project);
  }

  public readonly labels = () => new DocumentLabels(this, this.project);
  public readonly messages = () => new DocumentMessages(this, this.project);
}
