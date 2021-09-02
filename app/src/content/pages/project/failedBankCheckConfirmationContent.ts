import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class FailedBankCheckConfirmationContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "failed-bank-check-confirmation");
  }

  public readonly backLink = this.getContent("back-link");
  public readonly returnButton = this.getContent("return-to-setup");

  public readonly guidanceLine1 = this.getContent("guidance.line1");
  public readonly guidanceLine2 = this.getContent("guidance.line2");
  public readonly guidanceLine3 = this.getContent("guidance.line3");

  public readonly guidanceListIntro = this.getContent("guidance.list.intro");

  public readonly guidanceListItem1 = this.getContent("guidance.list.item1");
  public readonly guidanceListItem2 = this.getContent("guidance.list.item2");
  public readonly guidanceListItem3 = this.getContent("guidance.list.item3");
}
