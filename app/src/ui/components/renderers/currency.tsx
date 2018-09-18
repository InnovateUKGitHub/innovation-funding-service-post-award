import React from "react";
import {isNumber} from "../../../util/NumberHelper";

interface Props {
  value: number | null;
  fractionDigits?: number;
}

export const Currency: React.SFC<Props> = ({value, fractionDigits = 0}) => {
  if (!isNumber(value)) {
    return null;
  }
  const options = {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  };
  const valToRender = new Intl.NumberFormat("en-GB", options).format(value);
  return <span>{valToRender}</span>;
};
