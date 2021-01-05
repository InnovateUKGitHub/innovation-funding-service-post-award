import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";

export class FailedBankCheckConfirmationContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "failed-bank-check-confirmation", competitionType);
  }

  public readonly backLink = this.getContent("back-link");
  public readonly returnButton = this.getContent("return-to-setup");
  public readonly guidance = this.getContent("guidance", { markdown: true });
}
