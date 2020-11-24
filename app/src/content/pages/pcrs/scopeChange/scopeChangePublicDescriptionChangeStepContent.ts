import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRItem } from "../pcrItem";

export class PCRScopeChangePublicDescriptionChangeContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-scope-change-public-description-change", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);

  public readonly publicDescriptionHeading = this.getContent("heading-public-description");
  public readonly publishedDescription = this.getContent("published-description");
  public readonly noAvailableDescription = this.getContent("no-available-description");
}
