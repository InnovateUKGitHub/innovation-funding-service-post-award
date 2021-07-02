import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRScopeChangePublicDescriptionChangeContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-scope-change-public-description-change", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);

  public readonly publicDescriptionHeading = this.getContent("heading-public-description");
  public readonly publishedDescription = this.getContent("published-description");
  public readonly noAvailableDescription = this.getContent("no-available-description");
}
