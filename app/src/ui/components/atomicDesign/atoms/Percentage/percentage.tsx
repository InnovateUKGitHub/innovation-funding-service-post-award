import { isNumber } from "@framework/util/numberHelper";
import { Fragment } from "react";

export interface Props {
  value: number | null;
  fractionDigits?: number;
  defaultIfInfinite?: number;
}

export const Percentage: React.FunctionComponent<Props> = ({ value, fractionDigits = 2, defaultIfInfinite }: Props) => {
  if (!isNumber(value)) return null;

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  const absoluteNumber = Math.round(value * Math.pow(10, fractionDigits)) === 0 ? 0 : value;

  const shouldWordWrap = absoluteNumber > 1_000_000_000;
  const wordWrap = shouldWordWrap ? "normal" : "nowrap";

  // TODO we need to find out if Salesforce will be returning 0.75 vs 75 and possibly remove this "/100"
  const percentage = formatter.format(absoluteNumber / 100);

  // If we have a non-finite number, display the default "infinite" value.
  if (isNumber(defaultIfInfinite) && !isFinite(value)) {
    return <span style={{ whiteSpace: "nowrap" }}>{formatter.format(defaultIfInfinite)}</span>;
  }

  return (
    <span style={{ whiteSpace: wordWrap }}>
      {shouldWordWrap
        ? percentage.split(",").map((x, i, a) => (
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
        : percentage}
    </span>
  );
};
