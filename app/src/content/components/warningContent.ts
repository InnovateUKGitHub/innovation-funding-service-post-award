import { ContentBase } from "@content/contentBase";

export class WarningContent extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "warningContent", competitionType);
  }

  public readonly contactmessage = this.getContent("components.warningContent.contactmessage");
  private readonly advisoryGrantMoPmMessage = this.getContent("components.warningContent.advisoryGrantMoPmMessage");
  private readonly advisoryContractMoPmMessage = this.getContent(
    "components.warningContent.advisoryContractMoPmMessage",
  );
  public readonly advisoryMoPmMessage =
    this.getGrantOrContract() === "grant" ? this.advisoryGrantMoPmMessage : this.advisoryContractMoPmMessage;

  private readonly grantAmountRequestMessage = this.getContent("components.warningContent.grantAmountRequestMessage");
  private readonly contractAmountRequestMessage = this.getContent(
    "components.warningContent.contractAmountRequestMessage",
  );

  public readonly amountRequestMessage =
    this.getGrantOrContract() === "grant" ? this.grantAmountRequestMessage : this.contractAmountRequestMessage;
}
