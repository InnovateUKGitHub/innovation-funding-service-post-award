import { isNumber } from "@framework/util";

export interface Props {
  value: number | null;
  fractionDigits?: number;
}

export const Percentage: React.FunctionComponent<Props> = ({ value, fractionDigits = 2 }) => {
  if (!isNumber(value)) return null;

  const options = {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  };

  // Note: If the input matches a negative zero, then remove the change of a minus later on
  const absoluteNumber = Object.is(Math.sign(value), -0) ? Math.abs(value) : value;

  // TODO we need to find out if Salesforce will be returning 0.75 vs 75 and possibly remove this "/100"
  const percentage = new Intl.NumberFormat("en-GB", options).format(absoluteNumber / 100);

  return <span style={{ whiteSpace: "nowrap" }}>{percentage}</span>;
};
