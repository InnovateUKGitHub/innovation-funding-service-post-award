import { ContentBase } from "@content/contentBase";

export class PCRAddPartnerLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "pcr-add-partner-labels");
  }
  public readonly commercialWorkHeading = () => this.getContent("commercial-work-heading");
  public readonly commercialWorkHint = () => this.getContent("commercial-work-label-hint");
  public readonly commercialWorkLabel = () => this.getContent("commercial-work-label");
  public readonly commercialWorkNo = () => this.getContent("commercial-work-no");
  public readonly commercialWorkYes = () => this.getContent("commercial-work-yes");
  public readonly deMinimisDeclarationForm = () => this.getContent("de-minimis-declaration-form");
  public readonly organisationHeading = () => this.getContent("organisation-heading");
  public readonly roleHeading = () => this.getContent("role-heading");
}
