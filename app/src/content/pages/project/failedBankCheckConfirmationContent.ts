import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { ProjectDto } from "@framework/dtos";

export class FailedBankCheckConfirmationContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "failed-bank-check-confirmation", project);
  }

  public readonly backLink = this.getContent("back-link");
  public readonly returnButton = this.getContent("return-to-setup");
  public readonly guidance = this.getContent("guidance",  {markdown: true});
}
