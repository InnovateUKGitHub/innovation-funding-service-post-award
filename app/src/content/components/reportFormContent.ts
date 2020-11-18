import { ContentBase } from "../contentBase";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class ReportFormContent extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "reportForm", project);
  }

  public readonly reportMessage = this.getContent("components.reportForm.reportMessage");
  public readonly questionScoreMessage = this.getContent("components.reportForm.questionScoreMessage");
  public readonly continueText = this.getContent("components.reportForm.continueText");
  public readonly saveAndReturnText = this.getContent("components.reportForm.saveAndReturnText");
}
