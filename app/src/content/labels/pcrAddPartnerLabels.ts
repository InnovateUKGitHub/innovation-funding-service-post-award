import { ContentBase } from "@content/contentBase";

export class PCRAddPartnerLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "pcr-add-partner-labels");
  }

  public readonly roleHeading = () => this.getContent("role-heading");
  public readonly organisationHeading = () => this.getContent("organisation-heading");
}
