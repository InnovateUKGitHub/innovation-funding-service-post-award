import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { ProjectDto } from "@framework/dtos";

export class PCRAddPartnerOtherFundingContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-add-partner-other-funding", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRAddPartnerLabels(this, this.project);

  public readonly formSectionTitle = () => this.getContent("form-section-title");
  public readonly guidance = () => this.getContent("guidance", {markdown: true});
  public readonly questionLabel = () => this.getContent("label-other-sources-question");
}
