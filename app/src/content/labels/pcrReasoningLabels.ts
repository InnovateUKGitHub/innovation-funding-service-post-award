import { ContentBase } from "@content/contentBase";

export class PCRReasoningLabels extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "pcr-reasoning-labels", competitionType);
  }

  public readonly requestNumber = this.getContent("request-number");
  public readonly types = this.getContent("types");
  public readonly comments = this.getContent("comments");
  public readonly files = this.getContent("files");
}
