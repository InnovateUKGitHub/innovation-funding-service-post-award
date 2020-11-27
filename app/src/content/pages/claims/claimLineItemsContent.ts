import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ProjectDto } from "@framework/dtos";

export class ClaimLineItemsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claim-line-items", project);
  }

  public readonly supportingDocumentsTitle = this.getContent("supporting-documents-title");
  public readonly documentsInNewWindow = this.getContent("documents-in-new-window");
  public readonly noDocumentsUploaded = this.getContent("no-documents-uploaded");
  public readonly additionalInfoTitle = this.getContent("additional-info-title");
  public readonly noDataMessage = this.getContent("no-data-message");
  public readonly totalCostTitle = this.getContent("total-cost-title");
  public readonly forecastCostTitle = this.getContent("forecast-cost-title");
  public readonly differenceTitle = this.getContent("difference-title");
  public readonly descriptionHeader = this.getContent("description-header");
  public readonly costHeader = this.getContent("cost-header");
  public readonly lastUpdatedHeader = this.getContent("last-updated-header");
}
