import { ContentBase } from "../../contentBase";

export class PCRItem extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "pcr-item");
  }

  public readonly submitButton = () => this.getContent("submit-button");
  public readonly returnToSummaryButton = () => this.getContent("return-to-summary-button");
}
