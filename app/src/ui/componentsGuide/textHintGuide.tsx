import React from "react";
import { TextHint} from "../components/layout/textHint";
import { IGuide } from "@framework/types";

export const textHint: IGuide = {
  name: "TextHint",
  options: [
    {
      name: "Simple",
      comments: "Renders a text hint",
      example: "<TextHint text=\"Enter all labour costs in this period, describing each person’s role, how much time they spent on the project and so on. We will calculate your payment based on the agreed award offer rate.\"/>",
      render: () => <TextHint text="Enter all labour costs in this period, describing each person’s role, how much time they spent on the project and so on. We will calculate your payment based on the agreed award offer rate." />
    }
  ]
};
