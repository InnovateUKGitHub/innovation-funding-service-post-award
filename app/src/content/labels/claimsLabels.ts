import { ContentBase } from "@content/contentBase";

export class ClaimsLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "claims-labels");
  }

  partner = () => this.getContent("partner");
  forecastCosts = () => this.getContent("forecast-costs");
  actualCosts = () => this.getContent("actual-costs");
  difference = () => this.getContent("difference");
  status = () => this.getContent("status");
  lastUpdated = () => this.getContent("last-updated-date");
}
