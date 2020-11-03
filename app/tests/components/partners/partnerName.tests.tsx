import React from "react";
import { mount } from "enzyme";

import { PartnerDto } from "@framework/dtos";
import { PartnerName } from "@ui/components";

describe("Partner Name", () => {
  it("should render the partner name", () => {

    const partner: Partial<PartnerDto> = {
      name: "King James The Third",
      isWithdrawn: false,
      isLead: false,
    };

    const wrapper = mount(<p><PartnerName partner={partner as PartnerDto} /></p>);
    expect(wrapper.text()).toEqual("King James The Third");
  });
});
