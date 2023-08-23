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
};

/**
 * i18next Interpolation Options.
 * Shared between client/server to transform text inputs.
 */
const i18nInterpolationOptions: InterpolationOptions = {
  escapeValue: false,
};

export { i18nInterpolationOptions, registerIntlFormatter };
