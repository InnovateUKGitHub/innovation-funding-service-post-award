import React from "react";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import { SectionPanel } from "../../../src/ui/components/layout/sectionPanel";

describe("SectionPanel", () => {
  it("should render with the correct title", () => {
    const wrapper = mount(<SectionPanel title="test title" />);

    expect(wrapper.text()).toEqual("test title");
  });
});
