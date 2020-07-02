import { PCRPeriodLengthChangeLabels } from "@content/labels/pcrPeriodLengthChangeLabels";
import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";
import { PCRItem } from "@content/pages/pcrs/pcrItem";

export class PCRPeriodLengthChangeContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "pcr-period-length-change");
  }

  public readonly pcrItem = new PCRItem(this);
  public readonly labels = new PCRPeriodLengthChangeLabels(this);
  public readonly periodLengthQuarterly = () => this.getContent("period-length-quarterly");
  public readonly periodLengthMonthly = () => this.getContent("period-length-monthly");
  public readonly guidance = () => this.getContent("guidance", { markdown: true });
}
