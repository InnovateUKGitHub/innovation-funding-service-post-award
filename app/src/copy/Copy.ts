import { ProjectMonitoringLevel } from "@framework/constants/project";
import { Logger } from "@shared/developmentLogger";
import i18next, { i18n, TFunctionDetailedResult } from "i18next";
import { ContentSelectorFunctionParser } from "./ContentSelectorFunctionParser";
import {
  DataOption,
  ContentSelectorCallInformation,
  ContentSelector,
  TitleContentSelector,
  TitleContentResult,
} from "./type";
import { isString } from "lodash";

export class CopyContentInvalidInputKeyError extends Error {}

interface ICopy {
  competitionType?: string;
  monitoringLevel?: ProjectMonitoringLevel;
}

const isI18nDetailedResult = (
  i18nResult: string | TFunctionDetailedResult<string>,
): i18nResult is TFunctionDetailedResult<string> => typeof i18nResult === "object" && "res" in i18nResult;

/**
 * A repository of copy, with automatic competition type switching.
 */
class Copy {
  private logger = new Logger("Copy");
  protected competitionType?: string;
  protected monitoringLevel?: ProjectMonitoringLevel;
  public i18n: i18n;

  constructor({ competitionType, monitoringLevel }: ICopy = {}) {
    this.competitionType = competitionType?.replace(/ /g, "-").toLowerCase();
    this.monitoringLevel = monitoringLevel;
    this.i18n = i18next; // TODO: Create an instance instead of using a global instance
  }

  /**
   * Fetch information about the passed in content selection.
   *
   * @param fullKey The content selector
   * @returns Path taken by the content selector, as well as passed in data
   */
  public getContentCall(fullKey: ContentSelector | TitleContentSelector | string): ContentSelectorCallInformation {
    let i18nKey: string;
    const data: DataOption = {};

    if (this.monitoringLevel) {
      Object.assign(data, {
        context: this.monitoringLevel,
      });
    }

    // If the input key was a string...
    if (typeof fullKey === "string") {
      // Use the input key as the key
      i18nKey = fullKey;
    } else if (typeof fullKey === "function") {
      // If the input key was a function, aka a content selector...

      // Create a proxy to help parse the content selector
      const contentSelectorFunctionParser = new ContentSelectorFunctionParser();

      // Call the content selector and pass the proxy in
      fullKey(contentSelectorFunctionParser.getProxyContent());

      // Proxy now contains information about the Content Selector.
      const callInfo = contentSelectorFunctionParser.getContentCall();

      i18nKey = callInfo.i18nKey;
      Object.assign(data, callInfo.values);
    } else {
      // Crash when a non-string or non-content selector is passed in.
      this.logger.error(`Cannot translate invalid non-string/function key`, fullKey);
      throw new CopyContentInvalidInputKeyError(`Cannot translate invalid non-string/function key '${fullKey}'.`);
    }

    // If a competition type is specified, prefix all keys with the namespace.
    if (this.competitionType) {
      i18nKey = `${this.competitionType}:${i18nKey}`;
    }

    // Return resolved information.
    return {
      i18nKey,
      values: data,
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
    const { i18nKey, values: dataOption } = this.getContentCall(contentSelector);
    const i18nResult: string | TFunctionDetailedResult<string> =
      i18next.t(i18nKey, { ...options, ...dataOption }) || i18nKey;

    if (isI18nDetailedResult(i18nResult)) {
      return i18nResult.res;
    } else {
      return i18nResult;
    }
  }

  /**
   * Convert a content selector into a Route Title object.
   *
   * @param contentSelector The content selector
   * @returns A title content
   */
  public getTitleCopy(contentSelector: ContentSelector | TitleContentSelector): TitleContentResult {
    const { i18nKey, values: dataOption } = this.getContentCall(contentSelector);

    let htmlTitle;
    let displayTitle;

    // Attempt to fetch both HTML and Display titles.
    if (i18next.exists(i18nKey + ".html")) {
      htmlTitle = i18next.t(i18nKey + ".html", dataOption);
    }
    if (i18next.exists(i18nKey + ".display")) {
      displayTitle = i18next.t(i18nKey + ".display", dataOption);
    }

    // Fetch the fallback title.
    const titleOnly = i18next.t(i18nKey, dataOption);

    if (isString(htmlTitle) && isString(displayTitle) && isString(titleOnly)) {
      return {
        htmlTitle: htmlTitle || titleOnly,
        displayTitle: displayTitle || titleOnly,
      };
    } else {
      return {
        htmlTitle: htmlTitle?.toString() || titleOnly?.toString() || "",
        displayTitle: displayTitle?.toString() || titleOnly?.toString() || "",
      };
    }
  }
}

export { Copy };
