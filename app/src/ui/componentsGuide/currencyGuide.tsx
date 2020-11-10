import React from "react";
import { Currency } from "@ui/components/renderers";
import { IGuide } from "@framework/types";

export const currencyGuide: IGuide = {
  name: "Currency guide",
  options: [
    {
      name: "Whole number",
      comments: "To zero decimal places",
      example: "<Currency value={124} fractionDigits={0} />",
      render: () => <Currency value={124} fractionDigits={0} />
    },
    {
      name: "Two decimal places",
      comments: "To two decimal places",
      example: "<Currency value={124.91} fractionDigits={2} />",
      render: () => <Currency value={124.91} fractionDigits={2} />
    },
    {
      name: "Whole number, over one thousand",
      comments: "Includes comma separator",
      example: "<Currency value={4815162342} fractionDigits={0} />",
      render: () => <Currency value={4815162342} fractionDigits={0} />
    }
  ]
};
