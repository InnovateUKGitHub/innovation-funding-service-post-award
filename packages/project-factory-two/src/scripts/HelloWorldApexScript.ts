import { AbstractApexScript } from "./AbstractApexScript";

class HelloWorldApexScript extends AbstractApexScript {
  apex = `
    System.debug('Hello world!');
  `;
}

export { HelloWorldApexScript };
