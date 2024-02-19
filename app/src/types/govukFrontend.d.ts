declare module "govuk-frontend" {
  class Initable {
    constructor(component: HTMLElement);
  }

  class Accordion implements Initable {
    constructor(component: HTMLElement);
  }
  class Button implements Initable {
    constructor(component: HTMLElement);
  }
  class CharacterCount implements Initable {
    constructor(component: HTMLElement);
  }
  class Checkboxes implements Initable {
    constructor(component: HTMLElement);
  }
  class ErrorSummary implements Initable {
    constructor(component: HTMLElement);
  }
  class Header implements Initable {
    constructor(component: HTMLElement);
  }
  class Radios implements Initable {
    constructor(component: HTMLElement);
  }

  export { Accordion, Button, CharacterCount, Checkboxes, ErrorSummary, Header, Radios };
}
