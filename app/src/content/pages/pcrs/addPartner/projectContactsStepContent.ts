import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerProjectContactsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-project-contacts", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly sectionTitle = this.getContent("section-title");
  public readonly guidance = this.getContent("guidance");
  public readonly useFinanceDetails = this.getContent("use-finance-details");
  public readonly phoneNumberHint = this.getContent("phone-number-hint");
}
