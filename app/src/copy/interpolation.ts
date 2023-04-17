import { InterpolationOptions } from "i18next";

/**
 * i18next Interpolation Options.
 * Shared between client/server to transform text inputs.
 */
const i18nInterpolationOptions: InterpolationOptions = {
  format: (value, format) => {
    if (typeof value === "string" && format === "lowercase") return value.toLocaleLowerCase();
    if (Array.isArray(value) && format === "arrayJoin") return value.join(", ");
    return value;
  },
  escapeValue: false,
};

export { i18nInterpolationOptions };
