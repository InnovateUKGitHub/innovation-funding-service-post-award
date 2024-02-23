import React, { Fragment } from "react";
import cx from "classnames";
import { isNumber } from "@framework/util/numberHelper";
import { isNil } from "lodash";

interface CurrentArgs {
  value: number | null;
  fractionDigits?: number;
}

export interface CurrencyProps extends CurrentArgs {
  className?: string | false;
  style?: React.CSSProperties;
  qa?: string;
  bold?: boolean;
  noDefault?: boolean;
  id?: string;
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
export function Currency({ qa, value, bold, noDefault, fractionDigits = 2, className, ...props }: CurrencyProps) {
  const formattedValue = getCurrency(value, fractionDigits);

  // Enable word wrap if the value is above a trillion pounds.
  // If Innovate UK ever gives out a grant worth over trillion pounds, please fix.
  const shouldWordWrap = isNumber(value) && value > 1_000_000_000_000;
  const wordWrap = shouldWordWrap ? "normal" : "nowrap";

  if (noDefault && isNil(value)) {
    return null;
  }

  return (
    <span
      {...props}
      data-qa={qa}
      className={cx("currency", { "govuk-!-font-weight-bold": bold }, className)}
      style={{ ...props.style, whiteSpace: wordWrap }}
    >
      {shouldWordWrap
        ? formattedValue.split(",").map((x, i, a) => (
            // Inject ZWSP after commas as a word wrap hint.
            <Fragment key={i}>
              {x}
              {i < a.length - 1 && (
                <>
                  ,
                  <wbr />
                </>
              )}
            </Fragment>
          ))
        : formattedValue}
    </span>
  );
}
