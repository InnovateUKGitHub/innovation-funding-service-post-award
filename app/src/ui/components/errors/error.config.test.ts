import React from "react";
import { errorPages, InternalErrorTypes } from "@ui/components/errors/error.config";

describe("Error config", () => {
  test("returns available error views", () => {
    const errorConfigKeys = Object.keys(errorPages) as InternalErrorTypes[];

    // Note: This reduced config returns the name of the component as the value, this captures value changes on the config 😉
    const configValuesAsComponentNames = errorConfigKeys.reduce((acc, x) => {
      const configValueComponent = errorPages[x] as React.FunctionComponent<{}>;

      return {
        ...acc,
        [x]: configValueComponent.name,
      };
    }, {});

    expect(configValuesAsComponentNames).toMatchSnapshot();
  });
});
