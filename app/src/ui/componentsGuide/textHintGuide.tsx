import React from "react";
import { IGuide } from "@framework/types";
import { TextHint } from "../components/layout/textHint";

const sampleText = "Enter all labour costs in this period, describing each person’s role, how much time they spent on the project and so on. We will calculate your payment based on the agreed award offer rate.";

export const textHint: IGuide = {
  name: "TextHint",
  options: [
    {
      name: "Simple",
      comments: "Renders a text hint",
      example: `<TextHint>${sampleText}</TextHint>`,
      render: () => <TextHint>{sampleText}</TextHint>,
    },
  ],
};
