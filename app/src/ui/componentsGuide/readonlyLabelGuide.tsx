import React from "react";
import { ReadonlyLabel } from "@ui/components";
import { SimpleString } from "@ui/components/renderers";
import { IGuide } from "@framework/types";

export const readonlyLabel: IGuide = {
  name: "Readonly Label",
  options: [
    {
      name: "Simple",
      comments: "Show a value",
      example: "<ReadonlyLabel label={\"Partner name\"}><SimpleString>Rose Dawson</SimpleString></ReadonlyLabel>",
      render: () => (
        <ReadonlyLabel label={"Partner name"}><SimpleString>Rose Dawson</SimpleString></ReadonlyLabel>
      )
    }
  ]
};
