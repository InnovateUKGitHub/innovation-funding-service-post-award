import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { ProjectDto } from "@framework/dtos";

export class PCRAddPartnerAcademicCostsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-add-partner-academic-costs", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRAddPartnerLabels(this, this.project);

  public readonly stepGuidance = this.getContent("step-guidance");

  public readonly tsbLabel = this.getContent("tsb-label");

  public readonly costsSectionTitle = this.getContent("costs-section-title");
  public readonly costsGuidance = this.getContent("costs-guidance");

  public readonly categoryHeading = this.getContent("category-heading");
  public readonly costHeading = this.getContent("cost-heading");
  public readonly totalCosts = this.getContent("total-costs");
}
