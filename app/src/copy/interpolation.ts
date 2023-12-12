import { isNumber } from "@framework/util/numberHelper";
import bytes from "bytes";
import i18next, { InterpolationOptions } from "i18next";

const registerIntlFormatter = () => {
  i18next.services.formatter?.add("lookup", (value, _, options) => {
    const { within, from, to, context } = options ?? {};
    return context?.[within]?.find?.((x: AnyObject) => x?.[from] === value)?.[to] ?? "< i18n: missing value >";
  });

  i18next.services.formatter?.add("remove", (value, _, options) => {
    const { substring } = options ?? {};
    if (typeof value === "string" && typeof substring === "string") return value.replace(substring, "");
    return value;
  });

  i18next.services.formatter?.add("lowercase", value => {
    if (typeof value === "string") return value.toLocaleLowerCase();
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

  i18next.services.formatter?.add("currency", (value, _, options) => {
    const { fractionDigits } = options ?? { fractionDigits: 2 };
    if (typeof value === "number") {
      const currentLocale = "en-GB";
      const currencyOptions = {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      };

      const currencyValue = new Intl.NumberFormat(currentLocale, currencyOptions);
      const formatValue = isNumber(value) ? value : 0;

      return currencyValue.format(formatValue);
    }
    return value;
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
