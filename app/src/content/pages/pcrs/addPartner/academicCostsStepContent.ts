import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerAcademicCostsContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "pcr-add-partner-academic-costs");
  }

  public readonly pcrItem = new PCRItem(this);

  public readonly formSectionTitle = () => this.getContent("form-section-title");
  public readonly guidance = () => this.getContent("guidance");

  public readonly totalCosts = () => this.getContent("total-costs");
  public readonly categoryHeading = () => this.getContent("category-heading");
  public readonly costHeading = () => this.getContent("cost-heading");
}
