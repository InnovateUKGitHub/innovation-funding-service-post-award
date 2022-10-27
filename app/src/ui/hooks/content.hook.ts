import { useContext } from "react";
import type { ContentSelector, TranslationResult, ContentSelectorCallInformation } from "@copy/type";
import { contentContext } from "@ui/redux/contentProvider";

/**
 * Test an input to see if it matches a ContentSelector shape.
 *
 * @param content The input to test
 * @returns Whether the input was a ContentSelector
 * @author Neil Little
 */
export function isContentSolution(content: unknown): content is ContentSelector {
  const isNotString = typeof content !== "string";
  const isFn = typeof content === "function";

  return isNotString && isFn;
}

/**
 * Obtain a method to fetch content from the Copy Repository.
 *
 * @returns A competition-type dependant content fetching function.
 * @author Neil Little <neil.little@ukri.org>
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
export const useContent = () => {
  // Grab the Content Context
  const appContent = useContext(contentContext);

  // Crash out if `useContent` was not called inside the provider.
  if (!appContent) {
    throw new Error("useContent() must be used within a <ContentProvider />");
  }

  /**
   * Obtain the localisation of a translation.
   *
   * @param contentSelector A function that returns a path to a localisation
   * @returns The translated message
   * @author Neil Little <neil.little@ukri.org>
   * @example
   * <p>{getContent(x => x.pages.header.siteName)}</p>
   */
  const getContent = (contentSelector: ContentSelector | string): TranslationResult => {
    return appContent.getCopyString(contentSelector);
  };

  const getContentCall = (contentSelector: ContentSelector | string): ContentSelectorCallInformation => {
    return appContent.getContentCall(contentSelector);
  };

  return {
    getContent,
    getContentCall,
  };
};
