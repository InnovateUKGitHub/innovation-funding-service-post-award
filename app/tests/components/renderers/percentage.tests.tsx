import React from "react";
import { CondensedDateRange, FullDate, FullDateTime, LongDateRange, ShortDate, ShortDateRange, ShortDateTime } from "../../../src/ui/components/renderers/date";

import { mount, shallow } from "enzyme";
import { Percentage } from "../../../src/ui/components/renderers";

describe("Percentage", () => {
  it("should render the percentage with 1 decimal place by default", () => {
    const wrapper = mount(<Percentage value={100}/>);
    expect(wrapper.text()).toEqual("100.0%");
  });

  it("should render the percentage with 5 decimal places", () => {
    const wrapper = mount(<Percentage value={100} fractionDigits={5}/>);
    expect(wrapper.text()).toEqual("100.00000%");
  });

  it("should not render if no value is entered", () => {
    const wrapper = mount(<Percentage value={null}/>);
    expect(wrapper.html()).toBeNull();
  });
});
