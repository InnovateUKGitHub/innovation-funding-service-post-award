import { ContentBase } from "../contentBase";

export class WarningContent extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "warningContent", competitionType);
  }

  public readonly amountRequestMessage = this.getContent("components.warningContent.amountRequestMessage");
  public readonly contactmessage = this.getContent("components.warningContent.contactmessage");
  public readonly MOPMmessage = this.getContent("components.warningContent.MOPMmessage");
}
