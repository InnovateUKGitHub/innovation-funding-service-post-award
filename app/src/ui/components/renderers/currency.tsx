import React from "react";
import cx from "classnames";

import { isNumber } from "@framework/util";

interface CurrentArgs {
  value: number | null;
  fractionDigits?: number;
}

export interface CurrencyProps extends CurrentArgs {
  className?: string | false;
  style?: React.CSSProperties;
}

/**
 * @description Returns a primitive data type not a JSX.Element. Please use <Currency /> to support whiteSpace!
 */
export function getCurrency(value: CurrentArgs["value"], fractionDigits: CurrentArgs["fractionDigits"] = 2): string {
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

/**
 * Formatted currency component
 */
export function Currency({ value, fractionDigits = 2, className, ...props }: CurrencyProps) {
  const formattedValue = getCurrency(value, fractionDigits);

  return (
    <span {...props} className={cx("currency", className)} style={{ ...props.style, whiteSpace: "nowrap" }}>
      {formattedValue}
    </span>
  );
}
