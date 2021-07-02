import { ContentBase } from "@content/contentBase";

export class ForecastsLabels extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "forecasts-labels", competitionType);
  }

  public readonly overheadCosts = this.getContent("overhead-costs");
}
