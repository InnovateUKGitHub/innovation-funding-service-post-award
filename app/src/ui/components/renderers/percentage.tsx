import { isNumber } from "@framework/util";

interface Props {
  value: number | null;
  fractionDigits?: number;
}

export const Percentage: React.FunctionComponent<Props> = ({ value, fractionDigits = 2 }) => {
  if (!isNumber(value)) {
    return null;
  }

  const options = {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  };

  // @TODO we need to find out if Salesforce will be returning 0.75 vs 75 and possibly remove this "/100"
  let valToRender = new Intl.NumberFormat("en-GB", options).format(value/100);

  // we don't want to display negative zero percent
  if (valToRender === "-0.00%") {
    valToRender = valToRender.substring(1, valToRender.length);
  }

  return <span style={{ whiteSpace: "nowrap" }}>{valToRender}</span>;
};
