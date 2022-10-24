import { Logger } from "@shared/developmentLogger";
import i18next from "i18next";
import { ContentSelectorFunctionParser } from "./ContentSelectorFunctionParser";
import {
  DataOption,
  ContentSelectorCallInformation,
  ContentSelector,
  TitleContentSelector,
  TitleContentResult,
} from "./type";

export class CopyContentInvalidInputKeyError extends Error {}

/**
 * A repository of copy, with automatic competition type switching.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
class Copy {
  private logger = new Logger("Copy");
  protected competitionType?: string;

  constructor(competitionType?: string) {
    this.competitionType = competitionType?.replace(/ /g, "-").toLowerCase();
  }

  /**
   * Fetch information about the passed in content selection.
   *
   * @param fullKey The content selector
   * @returns Path taken by the content selector, as well as passed in data
   */
  private getContentCall(fullKey: ContentSelector | TitleContentSelector | string): ContentSelectorCallInformation {
    let key: string;
    let data: DataOption = {};

    // If the input key was a string...
    if (typeof fullKey === "string") {
      // Use the input key as the key
      key = fullKey;
    } else if (typeof fullKey === "function") {
      // If the input key was a function, aka a content selector...

      // Create a proxy to help parse the content selector
      const contentSelectorFunctionParser = new ContentSelectorFunctionParser();

      // Call the content selector and pass the proxy in
      fullKey(contentSelectorFunctionParser.getProxyContent());

      // Proxy now contains information about the Content Selector.
      const callInfo = contentSelectorFunctionParser.getContentCall();

      key = callInfo.key;
      data = callInfo.dataOption;
    } else {
      // Crash when a non-string or non-content selector is passed in.
      this.logger.error(`Cannot translate invalid non-string/function key`, fullKey);
      throw new CopyContentInvalidInputKeyError(`Cannot translate invalid non-string/function key '${fullKey}'.`);
    }

    // If a competition type is specified, prefix all keys with the namespace.
    if (this.competitionType) {
      key = `${this.competitionType}:${key}`;
    }

    // Return resolved information.
    return {
      key,
      dataOption: data,
    };
  }

  /**
   * Convert a content selector into a string.
   *
   * @param contentSelector The content selector
   * @param options Data to pass into the translation
   * @returns The copy as a string
   */
  public getCopyString(contentSelector: ContentSelector | string, options?: DataOption): string {
    const { key, dataOption } = this.getContentCall(contentSelector);
    return i18next.t(key, { ...options, ...dataOption }) || key;
  }

  /**
   * Convert a content selector into a Route Title object.
   *
   * @param contentSelector The content selector
   * @returns A title content
   */
  public getTitleCopy(contentSelector: ContentSelector | TitleContentSelector): TitleContentResult {
    const { key, dataOption } = this.getContentCall(contentSelector);

    let htmlTitle;
    let displayTitle;

    // Attempt to fetch both HTML and Display titles.
    if (i18next.exists(key + ".html")) {
      htmlTitle = i18next.t(key + ".html", dataOption);
    }
    if (i18next.exists(key + ".display")) {
      displayTitle = i18next.t(key + ".display", dataOption);
    }

    // Fetch the fallback title.
    const titleOnly = i18next.t(key, dataOption);

    return {
      htmlTitle: htmlTitle || titleOnly,
      displayTitle: displayTitle || titleOnly,
    };
  }
}

export { Copy };
