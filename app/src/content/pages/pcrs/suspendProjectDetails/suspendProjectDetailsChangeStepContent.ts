import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";

export class PCRScopeChangeProjectContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-suspend-project-details", competitionType);
  }

  public readonly suspendProjectIntro = this.getContent("suspend-project-intro");

  public readonly firstDayOfPauseTitle = this.getContent("first-day-of-pause-title");

  public readonly lastDayOfPauseTitle = this.getContent("last-day-of-pause-title");
  public readonly lastDayOfPauseHint = this.getContent("last-day-of-pause-hint");
}
