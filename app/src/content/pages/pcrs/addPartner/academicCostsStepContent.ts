import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerAcademicCostsContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "pcr-add-partner-academic-costs");
  }

  public readonly pcrItem = new PCRItem(this);

  public readonly stepTitle = () => this.getContent("step-title");
  public readonly stepGuidance = () => this.getContent("step-guidance");

  public readonly tsbSectionTitle = () => this.getContent("tsb-section-title");
  public readonly tsbLabel = () => this.getContent("tsb-label");

  public readonly costsSectionTitle = () => this.getContent("costs-section-title");
  public readonly costsGuidance = () => this.getContent("costs-guidance");

  public readonly categoryHeading = () => this.getContent("category-heading");
  public readonly costHeading = () => this.getContent("cost-heading");
  public readonly totalCosts = () => this.getContent("total-costs");
}
