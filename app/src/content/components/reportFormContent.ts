import { ContentBase } from "../contentBase";

export class ReportFormContent extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "reportForm", competitionType);
  }

  public readonly reportMessage = this.getContent("components.reportForm.reportMessage");
  public readonly questionScoreMessage = this.getContent("components.reportForm.questionScoreMessage");
  public readonly continueText = this.getContent("components.reportForm.continueText");
  public readonly saveAndReturnText = this.getContent("components.reportForm.saveAndReturnText");
}
