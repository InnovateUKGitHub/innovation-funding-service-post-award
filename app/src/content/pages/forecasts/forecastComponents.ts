import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ForecastsComponentsContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "forecasts-components");
  }

  public readonly adviseMessage = {
    part1: this.getContent("adviseMessage.part1"),
    part2Link: this.getContent("adviseMessage.part2Link"),
    part3: this.getContent("adviseMessage.part3"),
  };
}
