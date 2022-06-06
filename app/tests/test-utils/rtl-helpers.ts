import { Nullish, screen } from "@testing-library/react";

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

export function getByTextContent(textMatch: StringOrRegex): HTMLElement {
  return screen.getByText((...args) => validateTextPresence(...args, textMatch));
}

export async function findByTextContent(textMatch: StringOrRegex): Promise<HTMLElement> {
  return screen.findByText((...args) => validateTextPresence(...args, textMatch));
}
