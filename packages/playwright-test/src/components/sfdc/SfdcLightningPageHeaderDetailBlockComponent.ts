import { expect, Page } from "@playwright/test";
import { BaseComponent } from "../BaseComponent";
import { SfdcLightningPage } from "../../fixtures/sfdc/SfdcLightningPage";

export class SfdcLightningPageHeaderDetailBlockComponent extends BaseComponent {
  private readonly heading: string;

  constructor({ page, heading }: { page: Page; heading: string }) {
    super({ page });
    this.heading = heading;
  }

  get(): ReturnType<Page["locator"]> {
    return this.page.locator("records-highlights-details-item").filter({ hasText: this.heading });
  }

  static create({ page }: SfdcLightningPage, heading: string) {
    return new SfdcLightningPageHeaderDetailBlockComponent({ page, heading });
  }

  hasValue(value: string) {
    return expect(this.get().filter({ hasText: value })).toBeVisible();
  }
}
