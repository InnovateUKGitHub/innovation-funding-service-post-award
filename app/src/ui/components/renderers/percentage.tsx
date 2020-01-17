import React from "react";
import { isNumber } from "@framework/util";

interface Props {
  value: number | null;
  fractionDigits?: number;
}

export const Percentage: React.FunctionComponent<Props> = ({ value, fractionDigits = 1 }) => {
  if (!isNumber(value)) {
    return null;
  }

  const options = {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  };

  // @TODO we need to find out if Salesforce will be returning 0.75 vs 75 and possibly remove this "/100"
  const valToRender = new Intl.NumberFormat("en-GB", options).format(value/100);

  return <span style={{ whiteSpace: "nowrap" }}>{valToRender}</span>;
};
