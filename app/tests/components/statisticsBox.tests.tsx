import "jest";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";
import { StatisticsBox } from "@ui/components";

Enzyme.configure({ adapter: new Adapter() });

describe("StatisticsBox", () => {
  it("should render action message", () => {
    const wrapper = shallow(<StatisticsBox numberOfClaims={2} claimAction={"Review submitted claims"}/>).html();
    expect(wrapper).toContain(`<div class="govuk-body govuk-!-margin-bottom-0" style="color:#6f777b">Review submitted claims</div>`);
  });

  it("should render number of actions", () => {
    const wrapper = shallow(<StatisticsBox numberOfClaims={2} claimAction={"Review submitted claims"}/>).html();
    expect(wrapper).toContain(`<div class="govuk-heading-m">2</div>`);
  });
});
