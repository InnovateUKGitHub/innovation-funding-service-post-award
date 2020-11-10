import React from "react";
import { mount } from "enzyme";

import {
  ListItem,
  ListItemProps,
} from "../../../src/ui/components/layout/listItem";

describe("ListItem", () => {
  const setup = (props?: Partial<ListItemProps>) => {
    const defaultProps = {
      children: <div>some child element</div>,
    };

    const wrapper = mount(<ListItem {...defaultProps} {...props} />);

    // TODO: Improve this it is not resilient, consider refactoring to create a uid to query
    const listItem = wrapper.find("ListItem").children();

    return {
      wrapper,
      listItem,
    };
  };

  describe("@renders", () => {
    it("with action required styles", () => {
      const { listItem } = setup({ actionRequired: true });
      const listItemClasses = listItem.prop("className");

      expect(listItemClasses).toContain("actionRequired");
    });

    it("with default styles", () => {
      const { listItem } = setup();
      const listItemClasses = listItem.prop("className");

      expect(listItemClasses).not.toContain("actionRequired");
    });

    it("with qa value", () => {
      const stubQa = "stub-qa";
      const { listItem } = setup({ qa: stubQa });

      const qaValue = listItem.prop("data-qa");

      expect(qaValue).toBe(stubQa);
    });
  });
});
