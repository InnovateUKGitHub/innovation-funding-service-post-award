import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class FailedBankCheckConfirmationContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "failed-bank-check-confirmation", competitionType);
  }

  public readonly backLink = this.getContent("back-link");
  public readonly returnButton = this.getContent("return-to-setup");
  public readonly guidance = this.getContent("guidance", { markdown: true });
}
