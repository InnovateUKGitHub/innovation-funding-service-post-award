import { PCRPeriodLengthChangeLabels } from "@content/labels/pcrPeriodLengthChangeLabels";
import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { PCRItem } from "@content/pages/pcrs/pcrItem";
import { ProjectDto } from "@framework/dtos";

export class PCRPeriodLengthChangeContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-period-length-change", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRPeriodLengthChangeLabels(this, this.project);
  public readonly periodLengthQuarterly = this.getContent("period-length-quarterly");
  public readonly periodLengthMonthly = this.getContent("period-length-monthly");
  public readonly guidance = this.getContent("guidance", { markdown: true });
}
