import React from "react";
import { Button } from "@ui/components/styledButton";
import { IGuide } from "@framework/types";

export const buttonGuide: IGuide = {
  name: "Button",
  options: [
    {
      name: "Primary",
      comments: "A primary button",
      example: `<Button styling="Primary">A primary button</Button>`,
      render: () => <Button styling="Primary">A primary button</Button>
    },
    {
      name: "Secondary",
      comments: "A secondary button",
      example: `<Button styling="Secondary">A secondary button</Button>`,
      render: () => <Button styling="Secondary">A secondary button</Button>
    },
    {
      name: "Warning",
      comments: "A warning button",
      example: `<Button styling="Warning">A warning button</Button>`,
      render: () => <Button styling="Warning">A warning button</Button>
    },
    {
      name: "Link",
      comments: "A warning button",
      example: `<Button styling="Link">A link button</Button>`,
      render: () => <Button styling="Link">A link button</Button>
    }
  ]
};
