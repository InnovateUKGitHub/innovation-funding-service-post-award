import React from "react";
import { SimpleString } from "../components/renderers";
import { PageError } from "../components";

export const pageGuide: IGuide = {
  name: "PageError",
  options: [
    {
      name: "Simple",
      comments: "Renders page showing an error",
      example: "<PageError/>",
      render: () => (
        <PageError title="Something has gone wrong at our end">
          <SimpleString>You can either go back to the page you were previously on or go back to your <a href="/projects/dashboard">dashboard</a>.</SimpleString>
        </PageError>
      )
    }
  ]
};
