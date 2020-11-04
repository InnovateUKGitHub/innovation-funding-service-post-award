import { ContentBase } from "../contentBase";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class WarningContent extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "warningContent", project);
  }

  public readonly amountRequestMessage = this.getContent("components.warningContent.amountRequestMessage");
  public readonly contactmessage = this.getContent("components.warningContent.contactmessage");
  public readonly MOPMmessage = this.getContent("components.warningContent.MOPMmessage");
}
