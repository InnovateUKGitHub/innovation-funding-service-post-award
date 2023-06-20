import { isNumber } from "@framework/util/numberHelper";

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

  // Note: If the input matches a negative zero, then remove the change of a minus later on
  const absoluteNumber = Object.is(Math.sign(value), -0) ? Math.abs(value) : value;

  // TODO we need to find out if Salesforce will be returning 0.75 vs 75 and possibly remove this "/100"
  const percentage = formatter.format(absoluteNumber / 100);

  // If we have a non-finite number, display the default "infinite" value.
  if (isNumber(defaultIfInfinite) && !isFinite(value)) {
    return <span style={{ whiteSpace: "nowrap" }}>{formatter.format(defaultIfInfinite)}</span>;
  }

  return <span style={{ whiteSpace: "nowrap" }}>{percentage}</span>;
};
