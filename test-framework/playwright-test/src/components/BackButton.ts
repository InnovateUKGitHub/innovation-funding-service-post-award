import { BaseAccClickableComponent } from "./BaseAccComponent";

class BackButton extends BaseAccClickableComponent {
  selector() {
    return this.page.locator(".govuk-back-link");
  }
}

export { BackButton };
