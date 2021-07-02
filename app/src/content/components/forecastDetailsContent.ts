import { ContentBase } from "@content/contentBase";

export class ForecastDetailsContent extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "forecastDetails", competitionType);
  }

  public readonly finalClaimMessageFC = this.getContent("components.forecastDetails.finalClaimMessageFC");
  public readonly submitLink = this.getContent("components.forecastDetails.submitLink");
  public readonly finalClaimMessageMO = this.getContent("components.forecastDetails.finalClaimMessageMO");
  public readonly finalClaimDueMessageMO = this.getContent("components.forecastDetails.finalClaimDueMessageMO");
}
