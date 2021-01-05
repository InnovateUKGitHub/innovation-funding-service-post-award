import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";

export class PCRScopeChangePublicDescriptionChangeContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-scope-change-public-description-change", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);

  public readonly publicDescriptionHeading = this.getContent("heading-public-description");
  public readonly publishedDescription = this.getContent("published-description");
  public readonly noAvailableDescription = this.getContent("no-available-description");
}
