import React from "react";
import { Percentage } from "@ui/components/renderers";
import { IGuide } from "@framework/types";

export const percentageGuide: IGuide = {
  name: "Percentage",
  options: [
    {
      name: "Zero decimal places",
      comments: "Renders percentage with no decimal places",
      example: `<Percentage value={123.40} fractionDigits={0} />`,
      render: () => <Percentage value={123.40} fractionDigits={0} />
    },
    {
      name: "Two decimal places",
      comments: "Renders percentage with two decimal places",
      example: `<Percentage value={123.40} fractionDigits={2} />`,
      render: () => <Percentage value={123.40} fractionDigits={2} />
    }
  ]
};
