import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { DateFormat, formatDate } from "@framework/util";
import { ClaimsLabels } from "@content/labels/claimsLabels";

export class AllClaimsDashboardContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "all-claims-dashboard");
  }

  public guidanceMessage = () => this.getContent("guidance-message", { markdown: true });

  public openSection = {
    title: () => this.getContent("open-section.title"),
    noOpenClaimsMessage: (nextClaimStartDate: Date) => this.getContent("claims-messages.no-open-claims", {nextClaimStartDate: formatDate(nextClaimStartDate, DateFormat.FULL_DATE) }),
    noClaimsMessage: () => this.getContent("claims-messages.no-claims"),
  };

  public closedSection = {
    title: () => this.getContent("closed-section.title"),
    noClosedClaims: () => this.getContent("claims-messages.no-closed-claims")
  };

  public labels = new ClaimsLabels(this.content);
}
