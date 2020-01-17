import React from "react";
import { isNumber } from "@framework/util";

interface Props {
  value: number | null;
  fractionDigits?: number;
}

export const Currency: React.FunctionComponent<Props> = ({ value, fractionDigits = 2 }) => {
  const options = {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  };

  if (!isNumber(value)) {
    const zeroValue = new Intl.NumberFormat("en-GB", options).format(0);
    return <span style={{ whiteSpace: "nowrap" }}>{zeroValue}</span>;
  }

  const valToRender = new Intl.NumberFormat("en-GB", options).format(value);
  return <span style={{ whiteSpace: "nowrap" }}>{valToRender}</span>;
};
