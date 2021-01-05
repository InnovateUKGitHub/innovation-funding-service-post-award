import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";

export class PCRAddPartnerCompanyHouseContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "pcr-add-partner-company-house", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly sectionTitle = this.getContent("section-title");
  public readonly formHeading = this.getContent("heading-form");
  public readonly searchHeading = this.getContent("heading-search");
  public readonly searchButton = this.getContent("button-search");
  public readonly resultNotShowing = this.getContent("result-not-showing");
  public readonly searchResultsHeading = this.getContent("heading-search-results");
  public readonly hint = this.getContent("hint");
}
