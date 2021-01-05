import { ContentBase } from "@content/contentBase";

export class PCRPeriodLengthChangeLabels extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "pcr-period-length-change-labels", competitionType);
  }

  public readonly currentPeriodLength = this.getContent("current-period-length");
  public readonly newPeriodLength = this.getContent("new-period-length");
}
