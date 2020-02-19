import { ContentBase } from "../contentBase";
import { DateFormat, formatDate } from "@framework/util";

export class ClaimMessages extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "claims-messages");
  }

  public readonly guidanceMessage = () => this.getContent("guidance-message", {markdown: true});
  public readonly noOpenClaimsMessage = (nextClaimStartDate: Date) => this.getContent("no-open-claims", {nextClaimStartDate: formatDate(nextClaimStartDate, DateFormat.FULL_DATE) });
  public readonly noRemainingClaims = () => this.getContent("no-remaining-claims");
  public readonly noClosedClaims = () => this.getContent("no-closed-claims");
}
