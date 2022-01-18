import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

// Note: This class was created to gain access to .title() via ContentPageBase
export class ClaimSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claim-summary", competitionType);
  }
}
