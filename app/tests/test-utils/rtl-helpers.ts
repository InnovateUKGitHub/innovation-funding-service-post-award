import { screen } from "@testing-library/react";

export type Nullish<T> = T | null | undefined;

type StringOrRegex = string | RegExp;

/**
 * @description credit -> https://github.com/testing-library/dom-testing-library/issues/410#issuecomment-797486513
 */
const validateTextPresence = (_content: string, node: Nullish<Element>, textMatch: StringOrRegex) => {
  const hasText = (x: Element): boolean => x.textContent === textMatch;

  const nodeHasText = hasText(node as Element);
  const nodeChildren = Array.from(node?.children || []);
  const childrenDoesNotHaveText = nodeChildren.every(child => !hasText(child));

  return nodeHasText && childrenDoesNotHaveText;
};

/**
 * gets the element from the text content and validates its presence, uses RTL `get` method
 */
export function getByTextContent(textMatch: StringOrRegex): HTMLElement {
  return screen.getByText((...args) => validateTextPresence(...args, textMatch));
}

/**
 * finds the element by text content and validates, uses RTL `find` method which has async retry support
 */
export async function findByTextContent(textMatch: StringOrRegex): Promise<HTMLElement> {
  return screen.findByText((...args) => validateTextPresence(...args, textMatch));
}
