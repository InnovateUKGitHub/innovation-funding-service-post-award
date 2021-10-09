import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ClaimLineItemsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claim-line-items", competitionType);
  }

  public readonly supportingDocumentsTitle = this.getContent("supporting-documents-title");
  public readonly additionalInfoTitle = this.getContent("additional-info-title");
  public readonly noDataMessage = this.getContent("no-data-message");
  public readonly totalCostTitle = this.getContent("total-cost-title");
  public readonly forecastCostTitle = this.getContent("forecast-cost-title");
  public readonly differenceTitle = this.getContent("difference-title");
  public readonly descriptionHeader = this.getContent("description-header");
  public readonly costHeader = this.getContent("cost-header");
  public readonly lastUpdatedHeader = this.getContent("last-updated-header");
}
