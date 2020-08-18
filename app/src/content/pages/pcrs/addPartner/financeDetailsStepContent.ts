import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { ProjectDto } from "@framework/dtos";

export class PCRAddPartnerFinanceDetailsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-add-partner-finance-details", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRAddPartnerLabels(this, this.project);

  public readonly sectionTitle = () => this.getContent("section-title");
  public readonly yearEndHint = () => this.getContent("hint-year-end");
  public readonly turnoverHeading = () => this.getContent("heading-turnover");
}
