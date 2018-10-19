import React from "react";
import {isNumber} from "../../../util/NumberHelper";

interface Props extends React.HTMLAttributes<{}> {
  value: number | null;
  fractionDigits?: number;
}

export const Percentage: React.SFC<Props> = ({value, fractionDigits = 1, style, ...rest}) => {
  if (!isNumber(value)) {
    return null;
  }

  const options = {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  };

  style = Object.assign({ whiteSpace: "nowrap" }, style || {});

  // TODO we need to find out if Salesforce will be returning 0.75 vs 75 and possibly remove this "/100"
  const valToRender = new Intl.NumberFormat("en-GB", options).format(value/100);
  return <span style={style} {...rest}>{valToRender}</span>;
};
