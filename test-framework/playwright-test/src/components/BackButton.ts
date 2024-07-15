import { BaseClickableComponent } from "./BaseComponent";

class BackButton extends BaseClickableComponent {
  get() {
    return this.page.locator(".govuk-back-link");
  }
}

export { BackButton };
