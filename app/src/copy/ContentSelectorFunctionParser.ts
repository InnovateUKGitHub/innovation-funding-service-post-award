import { noop } from "@ui/helpers/noop";
import { PossibleCopyFunctions, PossibleCopyStrings, DataOption, ContentSelectorCallInformation } from "./type";

/**
 * Tool to intercept all ContentSelector calls to:
 * - Fetch the path that the content selector is traversing
 * - Intercept all inputs to the translation
 * - Return the path and input as string/object to translate with i18next
 *
 * Uses ECMAScript 6 Proxies, which are NOT supported in Internet Explorer 11.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
export class ContentSelectorFunctionParser<T extends object = PossibleCopyFunctions<PossibleCopyStrings>> {
  // A store for the path the ContentSelector has taken.
  private contentSelectorParts: string[] = [];

  // A store for the input passed into the ContentSelector
  private arguments: DataOption = {};

  // The proxy that intercepts the ContentSelector
  private proxy: T;

  constructor() {
    // Create a proxy.
    // The proxy target is `noop` instead of `null` because only functions can
    // have the `apply` property intercepted.
    const proxy: T = new Proxy<T>(noop as unknown as T, {
      get: (target, key) => {
        // When a property of the tree is fetched...
        if (typeof key === "string" && key !== "toString") {
          // Capture the property
          this.contentSelectorParts.push(key);
        }

        // Return the same proxy to extend the tree for any further property fetches.
        return proxy;
      },
      apply: (target, thisArg, args) => {
        // When the proxy is applied (aka called)...
        if (args.length === 1 && typeof args[0] === "object") {
          // Store the arguments
          this.arguments = args[0];
        }
      },
    });

    this.proxy = proxy;
  }

  /**
   * Get the proxy to capture the path a ContentSelector takes.
   *
   * @returns Proxy to use in-place of a real Content
   */
  public getProxyContent() {
    return this.proxy;
  }

  /**
   * Get information about the ContentSelector call.
   *
   * @returns Information about the ContentSelector
   */
  public getContentCall(): ContentSelectorCallInformation {
    return {
      i18nKey: this.contentSelectorParts.join("."),
      values: this.arguments,
    };
  }
}
