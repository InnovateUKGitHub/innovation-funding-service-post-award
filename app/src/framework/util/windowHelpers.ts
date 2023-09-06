import { useEffect } from "react";

export const scrollToTheTopSmoothly = () =>
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
export const scrollToTheTopInstantly = () => requestAnimationFrame(() => window.scrollTo(0, 0));

/**
 * Find a HTML element and scroll the page to the closest parent instance of FIELDSET.
 *
 * @param tag The HTML `name` or `id` to scroll to
 */
export const scrollToTheParentFieldsetSmoothly = (tag: string) => {
  /**
   * Find the closest HTML parent, starting from a child and climbing up to the parent.
   *
   * @param child The HTML element to start searching from
   * @param element The target HTML element, in uppercase characters
   * @returns The found HTML element, or null if not found.
   */
  const getParentElement = (child: HTMLElement, element: string): HTMLElement | null => {
    if (child.tagName === element) return child;
    if (child.parentElement) return getParentElement(child.parentElement, element);
    return null;
  };

  // Wait for the next animation frame before scrolling
  requestAnimationFrame(() => {
    // Find the first instance of the NAME or ID
    const [nameTag] = [...document.getElementsByName(tag), document.getElementById(tag)];

    // If it exists, scroll to it.
    if (nameTag) {
      const parentFieldset = getParentElement(nameTag, "FIELDSET");

      // If the parent fieldset exists, scroll to that.
      // Otherwise, just scroll to the tag.
      if (parentFieldset) {
        parentFieldset.scrollIntoView({ behavior: "smooth" });
      } else {
        nameTag.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
};

export const useScrollToTopSmoothly = (dependencies: unknown[]) => {
  useEffect(() => {
    scrollToTheTopSmoothly();
  }, dependencies);
};
