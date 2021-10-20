import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerCompanyHouseContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-company-house", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);

  public readonly sectionTitle = this.getContent("section-title");
  public readonly formHeading = this.getContent("heading-form");
  public readonly searchHeading = this.getContent("heading-search");
  public readonly searchButton = this.getContent("button-search");
  public readonly resultsLoading = this.getContent("results-loading");
  public readonly resultNotShowing = this.getContent("result-not-showing");
  public readonly searchResultsHeading = this.getContent("heading-search-results");
  public readonly hint = this.getContent("hint");
}
