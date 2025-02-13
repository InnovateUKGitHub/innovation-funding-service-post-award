import { AbstractApexScript } from "./AbstractApexScript";

class HelloWorldApexScript extends AbstractApexScript<Record<never, never>> {
  getApex = () => `
    System.debug('Hello world!');
  `;
}

export { HelloWorldApexScript };
