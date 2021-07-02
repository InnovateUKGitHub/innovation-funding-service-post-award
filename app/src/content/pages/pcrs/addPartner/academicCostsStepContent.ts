import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerAcademicCostsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-academic-costs", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly stepGuidance = this.getContent("step-guidance");

  public readonly tsbLabel = this.getContent("tsb-label");

  public readonly costsSectionTitle = this.getContent("costs-section-title");
  public readonly costsGuidance = this.getContent("costs-guidance");

  public readonly categoryHeading = this.getContent("category-heading");
  public readonly costHeading = this.getContent("cost-heading");
  public readonly totalCosts = this.getContent("total-costs");
}
