import { ContentBase } from "../../contentBase";

export class PCRItem extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "pcr-item", competitionType);
  }

  public readonly submitButton = this.getContent("submit-button");
  public readonly returnToSummaryButton = this.getContent("return-to-summary-button");
  public readonly returnToRequestButton = this.getContent("return-to-request-button");
}
