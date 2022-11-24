export{}

declare global {
    namespace Cypress {
      interface Chainable {
    /**
     * Gets an element by following the label attribute.
     * 
     * Pass in a string for the label name, and it will return the
     * element linked to the label
     */
        getByLabel(label: string): Chainable<Element>
      }
    }
  }