import { Logger } from "@shared/developmentLogger";

const logger = new Logger("Window Helpers");

export const scrollToTheTopSmoothly = () =>
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
export const scrollToTheTopInstantly = () => requestAnimationFrame(() => window.scrollTo(0, 0));

export const scrollToTheTagSmoothly = (tag: string) => {
  requestAnimationFrame(() => {
    // Find the first instance of the NAME or ID
    const element = [...document.getElementsByName(tag)]?.[0] ?? document.getElementById(tag);

    // If it exists, scroll to it.
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      logger.error("Failed to find element to scroll to", tag, element);
    }
  });
};
