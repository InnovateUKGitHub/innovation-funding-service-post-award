import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { ProjectDto } from "@framework/dtos";

export class PCRAddPartnerProjectContactsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-add-partner-project-contacts", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRAddPartnerLabels(this, this.project);

  public readonly sectionTitle = this.getContent("section-title");
  public readonly guidance = this.getContent("guidance");
  public readonly useFinanceDetails = this.getContent("use-finance-details");
  public readonly phoneNumberHint = this.getContent("phone-number-hint");
}
