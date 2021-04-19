import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";

export class PCRScopeChangeProjectContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "pcr-suspend-project-details");
  }

  public readonly suspendProjectIntro = this.getContent("suspend-project-intro");

  public readonly firstDayOfPauseTitle = this.getContent("first-day-of-pause-title");
  public readonly firstDayOfPauseHint = this.getContent("first-day-of-pause-hint");

  public readonly lastDayOfPauseTitle = this.getContent("last-day-of-pause-title");
  public readonly lastDayOfPauseHint = this.getContent("last-day-of-pause-hint");
}
