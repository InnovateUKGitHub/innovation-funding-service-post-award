import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { PartnerDto } from "@framework/dtos";
import { PartnerName } from "@ui/components";

Enzyme.configure({ adapter: new Adapter() });

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
