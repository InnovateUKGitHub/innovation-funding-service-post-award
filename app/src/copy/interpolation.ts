import { isNumber } from "@framework/util/numberHelper";
import bytes from "bytes";
import i18next, { InterpolationOptions } from "i18next";

const registerIntlFormatter = () => {
  i18next.services.formatter?.add("lookup", (value, _, options) => {
    const { within, from, to, context } = options ?? {};

    return context?.[within]?.find?.((x: AnyObject) => x?.[from] === value)?.[to] ?? "< i18n: missing value >";
  });

  i18next.services.formatter?.add("key", (value, _, options) => {
    /**
     * interpolator will replace a key, which should be a path to a label in the copy document with the value.
     *
     * e.g. "forms.pcr.financialTurnover.label" // "Financial turnover"
     *
     * when labels are language or namespace (e.g. KTP) dependent, will need to extend to read from options
     */
    const resource = i18next.getResource("en-GB", "default", options.label);
    if (!resource) {
      return value;
    }
    return resource;
  });

  i18next.services.formatter?.add("remove", (value, _, options) => {
    const { substring } = options ?? {};
    if (typeof value === "string" && typeof substring === "string") return value.replace(substring, "");
    return value;
  });

  i18next.services.formatter?.add("lowercase", value => {
    if (typeof value === "string") {
      return (
        value
          .split(" ")
          // do not lower case if word is more than 1 char and entirely upper case, since this is assumed to be an abbreviation
          .map(x => (x.length > 1 && /^[A-Z]+$/.test(x) ? x : x.toLocaleLowerCase()))
          .join(" ")
      );
    }
    if (Array.isArray(value)) return value.map(x => (typeof x === "string" ? x.toLocaleLowerCase() : x));
    return value;
  });

  i18next.services.formatter?.add("uppercase", value => {
    if (typeof value === "string") return value.toLocaleUpperCase();
    if (Array.isArray(value)) return value.map(x => (typeof x === "string" ? x.toLocaleUpperCase() : x));
    return value;
  });

  i18next.services.formatter?.add("arrayJoin", value => {
    if (Array.isArray(value)) return value.join(", ");
    return value;
  });

  i18next.services.formatter?.add("bytes", value => {
    if (typeof value === "number") return bytes(value);
    if (typeof value === "string") return bytes(value);
    return value;
  });

  i18next.services.formatter?.add("round", (value, _, options) => {
    const { dp } = options ?? {};
    if (typeof value === "number") return value.toFixed(Number(dp));
    return value;
  });

  i18next.services.formatter?.add("abs", value => {
    if (typeof value === "number") return Math.abs(value);
    return value;
  });

  i18next.services.formatter?.add("currency", (value: number, _, options?: { fractionDigits?: number }) => {
    const { fractionDigits } = options ?? { fractionDigits: 2 };
    if (typeof value === "number") {
      const currentLocale = "en-GB";

      const currencyOptions = {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      } as const;

      const currencyValue = new Intl.NumberFormat(currentLocale, currencyOptions);
      const formatValue = isNumber(value) ? value : 0;

      return currencyValue.format(formatValue);
    }
    return value;
  });

  i18next.services.formatter?.add("translateChar", value => {
    const translateChar = (char: unknown) => {
      if (typeof char !== "string") return value;

      const codepoint = char.codePointAt(0)?.toString(16);

      if (i18next.exists(`characters.${codepoint}`)) {
        return i18next.t(`characters.${codepoint}`);
      }

      return char;
    };

    if (Array.isArray(value)) return value.map(translateChar);
    return translateChar(value);
  });
};

/**
 * i18next Interpolation Options.
 * Shared between client/server to transform text inputs.
 */
const i18nInterpolationOptions: InterpolationOptions = {
  escapeValue: false,
};

export { i18nInterpolationOptions, registerIntlFormatter };
