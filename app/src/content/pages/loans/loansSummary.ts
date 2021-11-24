import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class LoansSummary extends ContentPageBase {
  constructor(content: Content) {
    super(content, "loans-summary");
  }

  public readonly loadingDrawdowns = this.getContent("loadingDrawdowns");
  public readonly rejectedDrawdownsError = this.getContent("rejectedDrawdownsError");
}
