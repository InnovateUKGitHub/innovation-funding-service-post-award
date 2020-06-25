import { ContentBase } from "@content/contentBase";

export class PCRAddPartnerLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "pcr-add-partner-labels");
  }

  public readonly roleHeading = () => this.getContent("role-heading");
  public readonly organisationHeading = () => this.getContent("organisation-heading");
  public readonly commercialWorkHeading = () => this.getContent("commercial-work-heading");
  public readonly commercialWorkLabel = () => this.getContent("commercial-work-label");
  public readonly commercialWorkHint = () => this.getContent("commercial-work-label-hint");
  public readonly commercialWorkYes = () => this.getContent("commercial-work-yes");
  public readonly commercialWorkNo = () => this.getContent("commercial-work-no");
}
