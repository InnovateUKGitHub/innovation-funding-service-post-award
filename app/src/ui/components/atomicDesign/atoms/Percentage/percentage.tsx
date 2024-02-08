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

  const percentage = formatter.format(Math.abs(value) / 100);

  // If we have a non-finite number, display the default "infinite" value.
  if (isNumber(defaultIfInfinite) && !isFinite(value)) {
    return <span style={{ whiteSpace: "nowrap" }}>{formatter.format(defaultIfInfinite)}</span>;
  }

  return <span style={{ whiteSpace: "nowrap" }}>{percentage}</span>;
};
